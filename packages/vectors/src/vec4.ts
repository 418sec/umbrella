import { IHash } from "@thi.ng/api";
import { EPS } from "@thi.ng/math";
import {
    IVector,
    MAX4,
    MIN4,
    ONE4,
    ReadonlyVec,
    Vec,
    X4,
    Y4,
    Z4,
    ZERO4
} from "./api";
import { eqDelta4 } from "./eqdelta";
import { hash } from "./hash";
import { declareIndices } from "./internal/accessors";
import { AVec } from "./internal/avec";
import {
    intoBuffer,
    mapBuffer,
    values,
    vecIterator
} from "./internal/vec-utils";
import { setS4 } from "./sets";

export class Vec4 extends AVec implements IHash<number>, IVector<Vec4> {
    /**
     * Returns array of memory mapped `Vec4` instances using given
     * backing array and stride settings: The `cstride` is the step size
     * between individual XYZ vector components. `estride` is the step
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
    static mapBuffer(
        buf: Vec,
        num: number = buf.length >> 2,
        start = 0,
        cstride = 1,
        estride = 4
    ) {
        return mapBuffer(Vec4, buf, num, start, cstride, estride);
    }

    /**
     * Merges given `src` iterable of `Vec4`s into single array `buf`.
     * Vectors will be arranged according to given component and element
     * strides, starting at `start` index. It's the user's
     * responsibility to ensure the target buffer has sufficient
     * capacity to hold the input vectors. See `Vec4.mapBuffer` for the
     * inverse operation. Returns `buf`.
     *
     * @param buf
     * @param src
     * @param start
     * @param cstride
     * @param estride
     */
    static intoBuffer(
        buf: Vec,
        src: Iterable<Vec4>,
        start = 0,
        cstride = 1,
        estride = 4
    ) {
        return intoBuffer(setS4, buf, src, start, cstride, estride);
    }

    static *iterator(
        buf: Vec,
        num: number,
        start = 0,
        cstride = 1,
        estride = 4
    ) {
        return vecIterator(Vec4, buf, num, start, cstride, estride);
    }

    static readonly X_AXIS = new Vec4(X4);
    static readonly Y_AXIS = new Vec4(Y4);
    static readonly Z_AXIS = new Vec4(Z4);
    static readonly MIN = new Vec4(MIN4);
    static readonly MAX = new Vec4(MAX4);
    static readonly ZERO = new Vec4(ZERO4);
    static readonly ONE = new Vec4(ONE4);

    x: number;
    y: number;
    z: number;
    w: number;
    [id: number]: number;

    constructor(buf?: Vec, offset = 0, stride = 1) {
        super(buf || [0, 0, 0, 0], offset, stride);
    }

    [Symbol.iterator]() {
        return values(this.buf, 4, this.offset, this.stride);
    }

    get length() {
        return 4;
    }

    copy() {
        return new Vec4([this.x, this.y, this.z, this.w]);
    }

    copyView() {
        return new Vec4(this.buf, this.offset, this.stride);
    }

    empty() {
        return new Vec4();
    }

    eqDelta(v: ReadonlyVec, eps = EPS) {
        return eqDelta4(this, v, eps);
    }

    hash() {
        return hash(this);
    }

    toJSON() {
        return [this.x, this.y, this.z, this.w];
    }

    toString() {
        return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`;
    }
}

declareIndices(Vec4.prototype, ["x", "y", "z", "w"]);

export const vec4 = (x = 0, y = 0, z = 0, w = 0) => new Vec4([x, y, z, w]);

export const vec4n = (n: number) => new Vec4([n, n, n, n]);

export const asVec4 = (x: Vec) =>
    x instanceof Vec4
        ? x
        : new Vec4(
              x.length >= 4 ? x : [x[0] || 0, x[1] || 0, x[2] || 0, x[3] || 0]
          );
