import { declareIndices, IVector } from "@thi.ng/vectors3";
import { Color, ColorMode } from "./api";
import { AColor } from "./internal/acolor";
import { ensureArgs } from "./internal/ensure-args";

export function ycbcra(col: Color): YCbCrA
export function ycbcra(y: number, b: number, r: number, a?: number): YCbCrA;
export function ycbcra(...args: any[]) {
    return new YCbCrA(ensureArgs(args));
}

export class YCbCrA extends AColor<YCbCrA> implements
    IVector<YCbCrA> {

    y: number;
    b: number;
    r: number;
    a: number;

    get mode() {
        return ColorMode.YCBCRA;
    }

    copy() {
        return new YCbCrA(this.deref());
    }

    copyView() {
        return new YCbCrA(this.buf, this.offset, this.stride);
    }

    empty() {
        return new YCbCrA();
    }
}

declareIndices(YCbCrA.prototype, ["y", "b", "r", "a"]);
