import { pointAtTheta } from "@thi.ng/geom-arc";
import {
    EPS,
    HALF_PI,
    PI,
    roundEps,
    sincos
} from "@thi.ng/math";
import { magSq2, ReadonlyVec, Vec } from "@thi.ng/vectors";
import { cubicFromLine } from "./cubic-line";

/**
 * Converts elliptic arc into a 1-4 cubic curve segments, depending on
 * arc's angle range.
 *
 * Partially based on:
 * {@link https://github.com/chromium/chromium/blob/master/third_party/blink/renderer/core/svg/svg_path_parser.cc#L253}
 *
 * @param pos -
 * @param r -
 * @param axis -
 * @param start -
 * @param end -
 */
export const cubicFromArc = (
    pos: ReadonlyVec,
    r: ReadonlyVec,
    axis: number,
    start: number,
    end: number
) => {
    const p = pointAtTheta(pos, r, axis, start);
    const q = pointAtTheta(pos, r, axis, end);
    const delta = end - start;
    const [rx, ry] = r;
    const [s, c] = sincos(axis);
    const dx = (c * (p[0] - q[0])) / 2 + (s * (p[1] - q[1])) / 2;
    const dy = (-s * (p[0] - q[0])) / 2 + (c * (p[1] - q[1])) / 2;
    if ((Math.abs(delta) < PI && dx === 0 && dy === 0) || magSq2(r) < EPS) {
        return [cubicFromLine(p, q)];
    }

    const mapP = (x: number, y: number) => {
        x *= rx;
        y *= ry;
        return [c * x - s * y + pos[0], s * x + c * y + pos[1]];
    };

    const res: Vec[][] = [];
    const n = Math.ceil(roundEps(Math.abs(delta) / HALF_PI, 1e-3));
    const d = delta / n;
    const t = (8 / 6) * Math.tan(0.25 * d);
    if (!isFinite(t)) {
        return [cubicFromLine(p, q)];
    }
    for (let i = n, theta = start, sc = sincos(theta); i > 0; i--, theta += d) {
        const [s1, c1] = sc;
        const [s2, c2] = (sc = sincos(theta + d));
        res.push([
            mapP(c1, s1),
            mapP(c1 - s1 * t, s1 + c1 * t),
            mapP(c2 + s2 * t, s2 - c2 * t),
            mapP(c2, s2)
        ]);
    }
    return res;
};
