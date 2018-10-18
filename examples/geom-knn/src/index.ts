import { timedResult } from "@thi.ng/bench";
import { KdTree } from "@thi.ng/geom-accel/kdtree";
import { canvas } from "@thi.ng/hdom-canvas";
import { gestureStream } from "@thi.ng/rstream-gestures";
import { sync } from "@thi.ng/rstream/stream-sync";
import { trigger } from "@thi.ng/rstream/trigger";
import { updateDOM } from "@thi.ng/transducers-hdom";
import { map } from "@thi.ng/transducers/xform/map";
import { mapcat } from "@thi.ng/transducers/xform/mapcat";
import { asVec2, Vec2 } from "@thi.ng/vectors/vec2";

const app = (main) => {
    // augment hdom-canvas component w/ `init` lifecycle method: this is
    // method is called when the canvas DOM element is first created and
    // used to attach a mouse & touch event stream to it. this stream is
    // then transformed using a transducer to only select the mouse
    // position and then added as new input to the `main` stream
    // combinator below...
    const _canvas = {
        ...canvas,
        init: (el: HTMLCanvasElement) =>
            main.add(gestureStream(el).transform(map((g) => g[1].pos)), "mpos")
    };
    // initialize 1st point & store in tree for fast KNN searches
    const width = window.innerWidth;
    const height = window.innerHeight;
    const initial = new Vec2([width / 2, height / 2, 5]);
    let tree = new KdTree<Vec2>(2, [initial]);

    // return root component function, triggered by each new mouse / touch event
    return ({ mpos }) => {
        // recreate tree every 500 points (in lieu of re-balancing)
        if (!(tree.length % 500)) {
            tree = new KdTree(2, tree);
        }
        mpos = mpos ? asVec2(mpos) : initial.copy();
        // record new pos in both tree
        tree.add(mpos);
        // even though we only create 2d vectors, we store a 3rd value
        // in the backing array, which will be later used as radius when
        // the point has been selected as part of a KNN query and is
        // visualized as circle.
        mpos.buf.push(1.5 + Math.random() * 5);
        // select max. 200 neighbors for given mouse position,
        // measure execution time...
        let [selected, t1] = timedResult(() =>
            tree.select(mpos, 200, width / 4)
        );
        // for each selected neighbor, perform another KNN search and
        // create line segments to each of these secondary matches
        // use `mapcat` to yield a flat array of lines
        let [neighbors, t2] = timedResult(() =>
            [...mapcat((p: Vec2) => tree.select(p, 8, width / 4).map((q) => ["line", {}, p, q]), selected)]
        );
        return ["div.overflow-hidden.sans-serif.f7",
            // tree stats
            ["div",
                `Points: ${tree.length}, Sel: ${selected.length}, `,
                `Neighbors: ${neighbors.length}, Q1: ${t1}ms, Q2: ${t2}ms, `,
                `Height: ${tree.root.height()}, Ratio: ${tree.balanceRatio().toFixed(2)}`],
            // visualize
            [_canvas, { width, height, __diff: false },
                // point cloud
                // TODO tree is iterable, but hdom-canvas currently expects arrays only
                ["points", { fill: "black" }, [...tree]],
                ["g", { fill: "rgba(0,192,255,0.5)" },
                    ...selected.map((p) => ["circle", {}, p, p.buf[2]])],
                ["g", { stroke: "rgba(0,0,0,0.25)" },
                    ...neighbors]]];
    };
};

// main stream combinator: initially only a single dummy `trigger` input
// is assigned to kick off rendering... in the 1st frame the canvas
// component's `init` method is called which attaches the above gesture
// stream dynamically. the entire UI then only updates when there are new
// user interactions...
const main = sync({ src: { trigger: trigger() } });
// transform result stream using the
// root component fn and the hdom differential
// update transducer
main.transform(
    map(app(main)),
    updateDOM()
);

if (process.env.NODE_ENV !== "production") {
    const hot = (<any>module).hot;
    hot && hot.dispose(() => main.done());
}
