import {
    add,
    direction,
    mixN,
    ReadonlyVec,
    set,
    Vec
} from "@thi.ng/vectors";

const buildUniform = (segments: Vec[], t: number) => {
    const res: Vec[][] = [];
    for (let i = 0, n = segments.length - 2; i < n; i += 2) {
        const a = segments[i];
        const b = segments[i + 1];
        const c = segments[i + 2];
        res.push([
            a,
            add(null, direction([], a, b, t), a),
            add(null, direction([], c, b, t), c),
            c
        ]);
    }
    return res;
};

const buildNonUniform = (segments: Vec[], t: number) => {
    const res: Vec[][] = [];
    for (let i = 0, n = segments.length - 2; i < n; i += 2) {
        const a = segments[i];
        const b = segments[i + 1];
        const c = segments[i + 2];
        res.push([a, mixN([], a, b, t), mixN([], c, b, t), c]);
    }
    return res;
};

export const closedCubicFromControlPoints = (
    points: ReadonlyVec[],
    t = 1,
    uniform = false
) => {
    const segments: Vec[] = [];
    for (let i = 0, num = points.length; i < num; i++) {
        const q = points[(i + 1) % num];
        segments.push(mixN([], points[i], q, 0.5), set([], q));
    }
    segments.push(segments[0]);
    return uniform ? buildUniform(segments, t) : buildNonUniform(segments, t);
};
