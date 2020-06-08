import { mixN, set, Vec } from "@thi.ng/vectors";

/**
 * Converts line segment `a` -> `b` into a cubic curve, which when
 * sampled yields uniformly spaced points. The inner control points are
 * located at 1/3 and 2/3 respectively.
 *
 * @param a - line endpoint
 * @param b - line endpoint
 */
export const cubicFromLine = (a: Vec, b: Vec) => [
    set([], a),
    mixN([], a, b, 1 / 3),
    mixN([], b, a, 1 / 3),
    set([], b),
];
