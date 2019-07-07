import { start } from "@thi.ng/hdom";
import { adaptDPI, canvasWebGL } from "@thi.ng/hdom-components";
import { PI } from "@thi.ng/math";
import { lookAt, ortho, scale44 } from "@thi.ng/matrices";
import { mapcat, range2d } from "@thi.ng/transducers";
import { normalize, rotateY } from "@thi.ng/vectors";
import {
    checkerboard,
    compileModel,
    cube,
    draw,
    GLMat4,
    GLVec3,
    LAMBERT,
    ModelSpec,
    shader,
    texture
} from "@thi.ng/webgl";

const app = () => {
    let model: ModelSpec;
    const GRID = 16;
    const canvas = canvasWebGL({
        init: (_, gl) => {
            const C1 = [0.5, 0.5, 0.5];
            const C2 = [1, 1, 1];
            model = compileModel(gl, {
                ...cube({ size: 0.9 }),
                instances: {
                    attribs: {
                        offset: {
                            data: new Float32Array([
                                ...mapcat(
                                    ([x, z]) => [
                                        x * 2,
                                        Math.sin(x * 0.4) + Math.sin(z * 0.4),
                                        z * 2
                                    ],
                                    range2d(-GRID + 1, GRID, -GRID + 1, GRID)
                                )
                            ])
                        },
                        icol: {
                            data: new Float32Array([
                                ...mapcat(
                                    () => (Math.random() < 0.5 ? C1 : C2),
                                    range2d(-GRID + 1, GRID, -GRID + 1, GRID)
                                )
                            ])
                        }
                    },
                    num: (GRID * 2 - 1) ** 2
                },
                shader: shader(
                    gl,
                    LAMBERT({
                        uv: "uv",
                        instancePos: "offset",
                        instanceColor: "icol",
                        state: { cull: true }
                    })
                ),
                uniforms: {},
                textures: [
                    texture(gl, {
                        image: checkerboard({
                            size: 8,
                            col1: 0xff808080,
                            col2: 0xffffffff,
                            corners: true
                        }),
                        filter: gl.NEAREST,
                        wrap: gl.CLAMP_TO_EDGE
                    })
                ]
            });
        },
        update: (el, gl, __, time) => {
            adaptDPI(el, window.innerWidth, window.innerHeight);
            const cam = [0, 2, 5];
            const eye = rotateY(
                null,
                [cam[0] + Math.sin(time * 0.0007) * 0, cam[1], cam[2]],
                -PI / 4 + Math.sin(time * 0.0005) * 0.1
            );
            const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
            const zoom = Math.sin(time * 0.0005) * 0.4 + 0.5;
            const scl = ((GRID * 2) / 3) * zoom;
            // prettier-ignore
            Object.assign(model.uniforms, {
                proj: <GLMat4>ortho([], -scl * aspect, scl * aspect, -scl, scl, -GRID * 2, GRID * 2),
                view: <GLMat4>lookAt([], eye, [0, 0, 0], [0, 1, 0]),
                model: <GLMat4>scale44([], [1, Math.sin(time * 0.001) + 1, 1]),
                lightDir: <GLVec3>rotateY(null, normalize(null, [-0.25, 1, 1]), 0)
            });
            const bg = 0.1;
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.clearColor(bg, bg, bg, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            draw(model);
        }
    });
    return () => [
        canvas,
        { width: window.innerWidth, height: window.innerHeight }
    ];
};

const cancel = start(app());

if (process.env.NODE_ENV !== "production") {
    const hot = (<any>module).hot;
    hot && hot.dispose(cancel);
}