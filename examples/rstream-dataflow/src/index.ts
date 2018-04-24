import { equiv } from "@thi.ng/api/equiv";
import { Atom } from "@thi.ng/atom/atom";
import { start } from "@thi.ng/hdom";
import { getIn } from "@thi.ng/paths";
import { fromRAF } from "@thi.ng/rstream/from/raf";
import { walk, toDot } from "@thi.ng/rstream-dot";
import { gestureStream } from "@thi.ng/rstream-gestures";
import { initGraph, node, node1 } from "@thi.ng/rstream-graph/graph";
import { extract } from "@thi.ng/rstream-graph/nodes/extract";
import { mul } from "@thi.ng/rstream-graph/nodes/math";
import { comp } from "@thi.ng/transducers/func/comp";
import { choices } from "@thi.ng/transducers/iter/choices";
import { dedupe } from "@thi.ng/transducers/xform/dedupe";
import { map } from "@thi.ng/transducers/xform/map";

import { circle } from "./circle";

// infinite iterator of randomized colors (Tachyons CSS class names)
// used by `color` graph node below
const colors = choices([
    "bg-red", "bg-blue", "bg-gold", "bg-light-green",
    "bg-pink", "bg-light-purple", "bg-orange", "bg-gray"
]);

// atom for storing dataflow results (optional, here only for
// debugging/stringifying graph state)
const db = new Atom<any>({});

// combined mouse & touch event stream
// this stream produces tuples of:
// [eventtype, [pos, clickpos, delta]]
// Note: only single touches are supported, no multitouch!
const gestures = gestureStream(document.getElementById("app"));

// requestAnimationFrame() based counter stream. this is consumed by the
// "sine" graph node below, but predefined here for visualization
// purposes (see end of file)
const raf = fromRAF();

// dataflow graph definition. each key in this object represents a node
// in the graph and its value is a `NodeSpec`. the `initGraph` function
// transforms these specs into a DAG (directed acyclic graph) of
// @thi.ng/rstream types, so each "node" is actually implemented as a
// stream of some kind...

// the lexical order of node specs is irrelevant, but since the graph is
// a DAG, no cyclic dependencies between nodes are allowed (and would
// result in a stack overflow during node resolution)

// the strings assigned to `out` values represent keys/paths in the
// above `db` state atom and are used to store current stream values.
// they're not necessary, but used here to capture and display the
// current internal state of the graph and is useful for debugging /
// backup etc.
const graph = initGraph(db, {

    // extracts current mouse/touch position from gesture tuple
    // the `[1, 0]` is the lookup path, i.e. `gesture[1][0]`
    mpos: {
        fn: extract([1, "pos"]),
        ins: [{ stream: () => gestures }],
        out: "mpos"
    },

    // extracts last click position from gesture tuple
    // the `[1, 1]` is the lookup path, i.e. `gesture[1][1]`
    // (only defined during drag gestures)
    clickpos: {
        fn: extract([1, "click"]),
        ins: [{ stream: () => gestures }],
        out: "clickpos"
    },

    // extracts & computes length of `delta` vector in gesture tuple
    // i.e. the distance between `clickpos` and current `mpos`
    // (`delta` is only defined during drag gestures)
    // `node1` is a helper function for nodes using only a single input
    dist: {
        fn: node1(map(
            (gesture) => {
                const delta = getIn(gesture, [1, "delta"]);
                return delta && Math.hypot.apply(null, delta) | 0;
            }
        )),
        ins: [{ stream: () => gestures }],
        out: "dist"
    },

    // combines `clickpos`, `dist` and `color` streams to produce a
    // stream of @thi.ng/hdom UI components (a circle around clickpos).
    // the resulting stream is then directly included in this app's root
    // component below... all inputs are locally renamed using the
    // stated input `id`s
    // `node` is a helper function to create a `StreamSync` based node
    // with multiple inputs
    circle: {
        fn: node(map(
            ({ click, radius, color }) =>
                click && radius && color ?
                    circle(color, click[0], click[1], radius * 2) :
                    undefined
        )),
        ins: [
            { stream: "clickpos", id: "click" },
            { stream: "radius", id: "radius" },
            { stream: "color", id: "color" },
        ],
        out: "circle"
    },

    // produces a new random color for each new drag gesture (and
    // therefore each new circle will have a potentially different
    // color). transformation is done using a composed transducer which
    // first dedupes click pos values and emits a new random color each
    // time clickpos is redefined (remember, clickpos is only defined
    // during drag gestures)
    color: {
        fn: node1(comp(
            dedupe(equiv),
            map((x) => x && colors.next().value)
        )),
        ins: [{ stream: "clickpos" }],
        out: "color"
    },

    // transforms a `requestAnimationFrame` event stream (frame counter @ 60fps)
    // into a sine wave with 0.6 .. 1.0 interval
    sine: {
        fn: node1(map((x: number) => 0.8 + 0.2 * Math.sin(x * 0.05))),
        ins: [{ stream: () => raf }],
        out: "sin"
    },

    // multiplies `dist` and `sine` streams to produce an animated
    // radius value for `circle`
    radius: {
        fn: mul,
        ins: [{ stream: "sine" }, { stream: "dist" }],
        out: "radius"
    }
});

// start @thi.ng/hdom update loop
start("app", () =>
    ["div",
        ["pre.absolute.top-1.left-1.pa0.ma0.z-2.f7",
            JSON.stringify(db.deref(), null, 2)],
        // note: direct embedding of result stream below. this works
        // since all @thi.ng/rstream subscriptions implement the
        // @thi.ng/api/IDeref interface (like several other types, e.g.
        // @thi.ng/atom's Atom, Cursor, View etc.)
        graph.circle
    ]);

// create a GraphViz DOT file of the entire dataflow graph
// copy the output from the console into a new text file and then run:
// `dot -Tsvg -o graph.svg graph.dot`
//
// see for more info:
// https://github.com/thi-ng/umbrella/tree/master/packages/rstream-dot
console.log(toDot(walk([gestures, raf])));
