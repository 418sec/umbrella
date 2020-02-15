import { Vec } from "@thi.ng/vectors";

/**
 * Performs Liang-Barsky clipping of the line segment with endpoints
 * `a`, `b` against the clipping rect defined by `min` and `max`. The
 * optional `ca` and `cb` vectors can be given to store the result
 * (clipped points). If omitted creates new vectors. Returns a tuple of
 * `[ca, cb, a, b]`, where the latter two values represent the
 * normalized distances of the clipped points relative to original given
 * line segment. Returns `undefined` iff the line lies completely
 * outside the rect.
 *
 * - {@link https://en.wikipedia.org/wiki/Liang%E2%80%93Barsky_algorithm}
 * - {@link https://github.com/thi-ng/c-thing/blob/master/src/geom/clip/liangbarsky.c}
 *
 * @param a - line endpoint
 * @param b - line endpoint
 * @param min - bbox min
 * @param max - bbox max
 * @param ca - result A
 * @param cb - result B
 */
export const liangBarsky2 = (
    a: Vec,
    b: Vec,
    min: Vec,
    max: Vec,
    ca: Vec = [],
    cb: Vec = []
): [Vec, Vec, number, number] | undefined => {
    const res = liangBarsky2Raw(
        a[0],
        a[1],
        b[0],
        b[1],
        min[0],
        min[1],
        max[0],
        max[1]
    );
    if (!res) return;

    ca[0] = res[0];
    ca[1] = res[1];
    cb[0] = res[2];
    cb[1] = res[3];

    return [ca, cb, res[4], res[5]];
};

/**
 * Same as {@link liangBarsky2} but for non-vector arguments.
 *
 * @param ax
 * @param ay
 * @param bx
 * @param by
 * @param minx
 * @param miny
 * @param maxx
 * @param maxy
 */
export const liangBarsky2Raw = (
    ax: number,
    ay: number,
    bx: number,
    by: number,
    minx: number,
    miny: number,
    maxx: number,
    maxy: number
): [number, number, number, number, number, number] | undefined => {
    const dx = bx - ax;
    const dy = by - ay;
    let alpha = 0;
    let beta = 1;

    const clip = (p: number, q: number) => {
        if (q < 0 && Math.abs(p) < 1e-6) {
            return false;
        }
        const r = q / p;
        if (p < 0) {
            if (r > beta) {
                return false;
            } else if (r > alpha) {
                alpha = r;
            }
        } else {
            if (r < alpha) {
                return false;
            } else if (r < beta) {
                beta = r;
            }
        }
        return true;
    };

    return clip(-dx, -(minx - ax)) &&
        clip(dx, maxx - ax) &&
        clip(-dy, -(miny - ay)) &&
        clip(dy, maxy - ay)
        ? [
              alpha * dx + ax,
              alpha * dy + ay,
              beta * dx + ax,
              beta * dy + ay,
              alpha,
              beta
          ]
        : undefined;
};
