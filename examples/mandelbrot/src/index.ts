import { equiv } from "@thi.ng/equiv";
import { canvas2D } from "@thi.ng/hdom-components/canvas";
import { fit } from "@thi.ng/math/fit";
import { mix } from "@thi.ng/math/mix";
import { gestureStream, GestureType } from "@thi.ng/rstream-gestures";
import { stream } from "@thi.ng/rstream/stream";
import { sync } from "@thi.ng/rstream/stream-sync";
import { tunnel } from "@thi.ng/rstream/tunnel";
import { updateDOM } from "@thi.ng/transducers-hdom";
import { tuples } from "@thi.ng/transducers/iter/tuples";
import { run } from "@thi.ng/transducers/run";
import { map } from "@thi.ng/transducers/xform/map";

// canvas size
const SIZE = 640;

const DEFAULT_REGION = [-1.65, -1, 0.65, 1, 128];

// format helper (for URL hash)
const ff = (x: number) => x.toExponential(8);

// mandelbrot parameter streams
const x1 = stream<number>();
const y1 = stream<number>();
const x2 = stream<number>();
const y2 = stream<number>();
const iter = stream<number>();
const sel1 = stream<number[]>();
const sel2 = stream<number[]>();

// main stream combinator
const main = sync({ src: { x1, y1, x2, y2, iter, sel1, sel2 } });

const updateRegion = (a, b, c, d, i = iter.deref()) => {
    x1.next(a);
    y1.next(b);
    x2.next(c);
    y2.next(d);
    iter.next(i);
    sel1.next(null);
    sel2.next(null);
};

// root component HOF
const app = () => {
    let img: ImageData;
    // canvas HOF component
    const canvas = canvas2D({
        // canvas init lifecycle method
        init: (el, ctx) => {
            // obtain canvas pixel buffer
            img = ctx.getImageData(0, 0, el.width, el.height);
            // setup render task stream pipeline
            // first we combine the various parameter streams
            // augment with canvas size
            // then submit tuple to worker and copy resulting pixels to canvas

            // any currently active worker will be terminated and
            // restarted with each param change. this is achieved via
            // the `interrupt` option and ensures only the most recent
            // configuration is being fully executed without having to
            // wait for older render tasks to complete...
            sync({ src: { x1, y1, x2, y2, iter } })
                .transform(map((obj) => ({ ...obj, w: el.width, h: el.height })))
                .subscribe(tunnel({ src: "./worker.js", interrupt: true }))
                .subscribe({
                    next: (pix: ArrayBuffer) => {
                        img.data.set(new Uint8Array(pix));
                        ctx.putImageData(img, 0, 0);
                    }
                });
            // also initialize gesture stream for allowing users to draw
            // target zoom rectangle
            gestureStream(el, { scale: true, absZoom: false, smooth: 1e-3 })
                .subscribe({
                    next: ([type, { pos, zoom }]: [GestureType, any]) => {
                        const _x1 = x1.deref();
                        const _y1 = y1.deref();
                        const _x2 = x2.deref();
                        const _y2 = y2.deref();
                        switch (type) {
                            case GestureType.START:
                                sel1.next(pos);
                                break;
                            case GestureType.DRAG:
                                sel2.next(pos);
                                break;
                            case GestureType.END: {
                                const p = sel1.deref();
                                if (equiv(p, pos)) return;
                                // compute target coord based on current zoom region
                                let ax = fit(p[0], 0, el.width, _x1, _x2);
                                let ay = fit(p[1], 0, el.height, _y1, _y2);
                                let bx = fit(pos[0], 0, el.width, _x1, _x2);
                                let by = fit(pos[1], 0, el.height, _y1, _y2);
                                if (ax > bx) {
                                    const t = ax;
                                    ax = bx;
                                    bx = t;
                                }
                                if (ay > by) {
                                    const t = ay;
                                    ay = by;
                                    by = t;
                                }
                                const aspect = (bx - ax) / (by - ay);
                                // adjust aspect ratio of target region
                                if (aspect > 1) {
                                    by = ay + (bx - ax);
                                } else if (aspect < 1) {
                                    bx = ax + (by - ay);
                                }
                                updateRegion(ax, ay, bx, by);
                                break;
                            }
                            case GestureType.ZOOM:
                                updateRegion(
                                    mix(_x1, _x2, zoom),
                                    mix(_y1, _y2, zoom),
                                    mix(_x2, _x1, zoom),
                                    mix(_y2, _y1, zoom)
                                );
                            default:
                        }
                    }
                });
            // key controls fine tuning region
            window.addEventListener("keydown", (e) => {
                let _x1 = x1.deref();
                let _y1 = y1.deref();
                let _x2 = x2.deref();
                let _y2 = y2.deref();
                const amp = e.shiftKey ? 0.1 : 0.01;
                const deltaX = (_x2 - _x1) * amp;
                const deltaY = (_y2 - _y1) * amp;
                switch (e.code) {
                    case "ArrowDown":
                        _y1 += deltaY;
                        _y2 += deltaY;
                        updateRegion(_x1, _y1, _x2, _y2);
                        break;
                    case "ArrowUp":
                        _y1 -= deltaY;
                        _y2 -= deltaY;
                        updateRegion(_x1, _y1, _x2, _y2);
                        break;
                    case "ArrowLeft":
                        _x1 -= deltaX;
                        _x2 -= deltaX;
                        updateRegion(_x1, _y1, _x2, _y2);
                        break;
                    case "ArrowRight":
                        _x1 += deltaX;
                        _x2 += deltaX;
                        updateRegion(_x1, _y1, _x2, _y2);
                        break;
                }
            });
        },
        // canvas update handler
        update: (_, ctx, ...args) => {
            const a = args[4];
            const b = args[5];
            ctx.putImageData(img, 0, 0);
            // if given, draw zoom rectangle
            if (a && b) {
                ctx.strokeStyle = "red";
                ctx.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
            }
        }
    });
    // return actual root component function
    return ({ sel1, sel2 }) => {
        return ["div.flex-l.sans-serif.f7",
            [canvas, { id: "main", width: SIZE, height: SIZE }, sel1, sel2],
            ["div.pa2.lh-copy",
                ["h1.ma0", "Mandelbrot explorer"],
                [slider, x1, -2.5, 1, 1e-8, "x1"],
                [slider, y1, -1, 1, 1e-8, "y1"],
                [slider, x2, -2.5, 1, 1e-8, "x2"],
                [slider, y2, -1, 1, 1e-8, "y2"],
                [slider, iter, 1, 1000, 1, "iter"],
                ["button", {
                    onclick: () => updateRegion.apply(null, DEFAULT_REGION),
                }, "reset"],
                ["div",
                    ["ul",
                        ["li", "Click & drag to draw target zoom rectangle"],
                        ["li", "Mouse wheel to zoom in / out"],
                        ["li", "Cursor keys to fine tune region (+ Shift for bigger steps)"],
                    ]
                ]
            ]
        ];
    };
};

// slider component which emits value changes on given stream
const slider = (_, stream, min, max, step, label) =>
    ["div",
        ["div", ["strong", `${label}: `], stream.deref()],
        ["input", {
            type: "range",
            style: { width: "50vw" },
            min,
            max,
            step,
            value: stream.deref(),
            oninput: (e) => stream.next(parseFloat(e.target.value)),
        }]
    ];

// URL hash updater
main.subscribe({
    next: ({ x1, y1, x2, y2, n }) =>
        location.hash = `${ff(x1)};${ff(y1)};${ff(x2)};${ff(y2)};${n}`
});

// attach root component & DOM update to main stream
main.transform(
    map(app()),
    updateDOM()
);

// pre-seed parameter streams, if possible from location.hash
run(
    map(([src, x]) => src.next(x)),
    tuples(
        [x1, y1, x2, y2, iter],
        location.hash.length > 1 ?
            location.hash.substr(1).split(";").map(parseFloat) :
            DEFAULT_REGION
    )
);

// pre-seed selection stream (zoom rect)
sel1.next(null);
sel2.next(null);

// HMR handling
if (process.env.NODE_ENV !== "production") {
    const hot = (<any>module).hot;
    hot && hot.dispose(() => main.done());
}
