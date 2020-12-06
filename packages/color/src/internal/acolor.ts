import type { IDeref } from "@thi.ng/api";
import { EPS } from "@thi.ng/math";
import { eqDelta4, stridedValues } from "@thi.ng/vectors";
import type { Color, IColor } from "../api";
import type { ColorMode } from "../constants";

export abstract class AColor<T extends Color> implements IColor, IDeref<Color> {
    buf: Color;
    offset: number;
    stride: number;
    [id: number]: number;

    constructor(buf?: Color, offset = 0, stride = 1) {
        this.buf = buf || [0, 0, 0, 0];
        this.offset = offset;
        this.stride = stride;
    }

    [Symbol.iterator]() {
        return stridedValues(this.buf, 4, this.offset, this.stride);
    }

    abstract get mode(): ColorMode;

    get length() {
        return 4;
    }

    deref(): Color {
        return [this[0], this[1], this[2], this[3]];
    }

    eqDelta(o: T, eps = EPS): boolean {
        return eqDelta4(this, o, eps);
    }
}
