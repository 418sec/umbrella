import { HALF_PI, inRange, roundTo } from "@thi.ng/math";
import {
    MAX2,
    max2,
    MIN2,
    min2,
    ReadonlyVec,
    set2,
    VecPair
} from "@thi.ng/vectors";
import { pointAtTheta } from "./point-at";

export const bounds = (
    pos: ReadonlyVec,
    r: ReadonlyVec,
    axis: number,
    start: number,
    end: number
): VecPair => {
    const min = set2([], MAX2);
    const max = set2([], MIN2);
    const p = [];
    const update = (theta: number) => {
        pointAtTheta(pos, r, axis, theta, p);
        min2(null, min, p);
        max2(null, max, p);
    };
    update(start);
    update(end);
    if (start > end) {
        const t = start;
        start = end;
        end = t;
    }
    // include multiples of π/2 within [start,end] interval
    for (
        let i = roundTo(start, HALF_PI), j = roundTo(end, HALF_PI);
        i < j;
        i += HALF_PI
    ) {
        inRange(i, start, end) && update(i);
    }
    return [min, max];
};
