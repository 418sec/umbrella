import type { Fn } from "@thi.ng/api";
import { ensureArray } from "@thi.ng/arrays";
import { mix } from "@thi.ng/math";
import { juxtR, map, max, min, transduce } from "@thi.ng/transducers";
import type { Domain } from "./api";

export const uniformDomain = ([d1, d2]: Domain, src: Iterable<number>) => {
    const vals = ensureArray(src);
    const norm = vals.length > 1 ? 1 / (vals.length - 1) : 0;
    return vals.map((x, i) => [mix(d1, d2, i * norm), x]);
};

export const dataBounds = <T>(fn: Fn<T, number>, src: T[], pad = 0) => {
    const b = transduce(map(fn), juxtR(min(), max()), src);
    b[0] -= pad;
    b[1] += pad;
    return b;
};

export const dataBounds2 = <T>(
    min: Fn<T, number>,
    max: Fn<T, number>,
    src: T[],
    padMin = 0,
    padMax = padMin
) => [dataMin(min, src, padMin), dataMax(max, src, padMax)];

export const dataMin = <T>(fn: Fn<T, number>, src: T[], pad = 0) =>
    transduce(map(fn), min(), src) - pad;

export const dataMax = <T>(fn: Fn<T, number>, src: T[], pad = 0) =>
    transduce(map(fn), max(), src) + pad;
