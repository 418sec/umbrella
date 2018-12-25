import { EPS } from "@thi.ng/math/api";
import {
    IVector,
    MAX2,
    MIN2,
    ONE2,
    ReadonlyVec,
    Vec,
    X2,
    Y2,
    ZERO2
} from "./api";
import { eqDelta2 } from "./eqdelta";
import { declareIndices } from "./internal/accessors";
import { AVec } from "./internal/avec";
import {
    intoBuffer,
    mapBuffer,
    values,
    vecIterator
} from "./internal/vec-utils";
import { setS2 } from "./sets";

export class Vec2 extends AVec implements
    IVector<Vec2> {

    /**
     * Returns array of memory mapped `Vec2` instances using given
     * backing array and stride settings: The `cstride` is the step size
     * between individual XY vector components. `estride` is the step
     * size between successive vectors. This arrangement allows for
     * different storage approaches, incl. SOA, AOS, striped /
     * interleaved etc.
     *
     * @param buf backing array
     * @param num num vectors
     * @param start  start index
     * @param cstride component stride
     * @param estride element stride
     */
    static mapBuffer(buf: Vec, num: number = buf.length >> 1, start = 0, cstride = 1, estride = 2) {
        return mapBuffer(Vec2, buf, num, start, cstride, estride);
    }

    /**
     * Merges given `src` iterable of `Vec2`s into single array `buf`.
     * Vectors will be arranged according to given component and element
     * strides, starting at `start` index. It's the user's
     * responsibility to ensure the target buffer has sufficient
     * capacity to hold the input vectors. See `Vec2.mapBuffer` for the
     * inverse operation. Returns `buf`.
     *
     * @param buf
     * @param src
     * @param start
     * @param cstride
     * @param estride
     */
    static intoBuffer(buf: Vec, src: Iterable<Vec2>, start = 0, cstride = 1, estride = 2) {
        return intoBuffer(setS2, buf, src, start, cstride, estride);
    }

    static iterator(buf: Vec, num: number, start = 0, cstride = 1, estride = 2) {
        return vecIterator(Vec2, buf, num, start, cstride, estride);
    }

    static readonly X_AXIS = new Vec2(X2);
    static readonly Y_AXIS = new Vec2(Y2);
    static readonly MIN = new Vec2(MIN2);
    static readonly MAX = new Vec2(MAX2);
    static readonly ZERO = new Vec2(ZERO2);
    static readonly ONE = new Vec2(ONE2);

    x: number;
    y: number;
    [id: number]: number;

    constructor(buf?: Vec, offset = 0, stride = 1) {
        super(buf || [0, 0], offset, stride);
    }

    [Symbol.iterator]() {
        return values(this.buf, 2, this.offset, this.stride);
    }

    get length() {
        return 2;
    }

    copy() {
        return new Vec2([this.x, this.y]);
    }

    copyView() {
        return new Vec2(this.buf, this.offset, this.stride);
    }

    empty() {
        return new Vec2();
    }

    eqDelta(v: ReadonlyVec, eps = EPS) {
        return eqDelta2(this, v, eps);
    }

    toJSON() {
        return [this.x, this.y];
    }

    toString() {
        return `[${this.x}, ${this.y}]`;
    }
}

declareIndices(Vec2.prototype, ["x", "y"]);

export const vec2 =
    (x = 0, y = 0) => new Vec2([x, y]);

export const vec2n =
    (n: number) => new Vec2([n, n]);

export const asVec2 =
    (x: Vec) =>
        x instanceof Vec2 ?
            x :
            new Vec2(x.length >= 2 ? x : [x[0] || 0, x[1] || 0]);
