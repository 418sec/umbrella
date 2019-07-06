import {
    $x,
    $y,
    add,
    defn,
    div,
    float,
    int,
    modi,
    mul,
    ret,
    vec2
} from "@thi.ng/shader-ast";

/**
 * Converts linearized 2D index `i` into a vec2 UV coord, based on given
 * texture `size` (in pixels).
 *
 * @param i
 * @param size
 */
export const indexToUV = defn(
    "vec2",
    "indexToUV",
    [["int", "i", { prec: "highp" }], ["ivec2"]],
    (i, size) => [
        ret(
            vec2(
                div(float(modi(i, $x(size))), float($x(size))),
                div(float(div(i, $x(size))), float($y(size)))
            )
        )
    ]
);

/**
 * Inverse operation of `indexToUV()`. Converts vec2 UV coord into
 * linearized 2D index, based on given texture `width` (in pixels).
 *
 * @param i
 * @param width
 */
export const uvToIndex = defn(
    "int",
    "uvToIndex",
    [["vec2"], ["int", "width", { prec: "highp" }]],
    (uv, width) => [
        ret(
            add(
                int(mul($x(uv), float(width))),
                int(mul($y(uv), float(mul(width, width))))
            )
        )
    ]
);
