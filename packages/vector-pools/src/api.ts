import {
    GLType,
    ILogger,
    IObjectOf,
    IRelease,
    NULL_LOGGER,
    Type,
    TypedArray
} from "@thi.ng/api";
import { MemPool, MemPoolOpts } from "@thi.ng/malloc";
import { ReadonlyVec, StridedVec, Vec } from "@thi.ng/vectors";

export interface AttribSpec {
    type: GLType | Type;
    size: number;
    byteOffset: number;
    stride?: number;
    default?: number | ReadonlyVec;
    data?: ReadonlyVec | ReadonlyVec[];
    index?: number;
}

export interface AttribPoolOpts {
    mem: MemPool | Partial<MemPoolOpts>;
    attribs?: IObjectOf<AttribSpec>;
    num: number;
    resizable?: boolean;
}

export interface IVecPool extends IRelease {
    malloc(size: number, type?: GLType | Type): TypedArray | undefined;

    mallocWrapped(
        size: number,
        stride?: number,
        type?: GLType | Type
    ): StridedVec | undefined;

    mallocArray(
        num: number,
        size: number,
        cstride?: number,
        estride?: number,
        type?: GLType | Type
    ): StridedVec[] | undefined;

    free(vec: StridedVec | TypedArray): boolean;

    freeAll(): void;
}

export type VecFactory = (
    buf: Vec,
    size: number,
    index: number,
    stride: number
) => StridedVec;

export let LOGGER = NULL_LOGGER;

export const setLogger = (logger: ILogger) => (LOGGER = logger);
