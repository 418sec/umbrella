import { Fn } from "@thi.ng/api";
import { isBoolean, isNumber } from "@thi.ng/checks";
import { Lit, Term } from "../api/nodes";
import {
    FloatTerm,
    IntTerm,
    UintTerm,
    Vec2Term,
    Vec3Term,
    Vec4Term
} from "../api/terms";
import {
    NumericB,
    NumericF,
    NumericI,
    NumericU,
    Type
} from "../api/types";
import { isVec } from "./checks";

export const lit = <T extends Type>(
    type: T,
    val: any,
    info?: string
): Lit<T> => ({
    tag: "lit",
    type,
    info,
    val
});

export const bool = (x: NumericB) => lit("bool", isNumber(x) ? !!x : x);

export const float = (x: NumericB) =>
    lit("float", isBoolean(x) ? (<any>x) & 1 : x);

export const int = (x: NumericB) =>
    lit("int", isBoolean(x) ? (<any>x) & 1 : isNumber(x) ? x | 0 : x);

export const uint = (x: NumericB) =>
    lit("uint", isBoolean(x) ? (<any>x) & 1 : isNumber(x) ? x >>> 0 : x);

const wrap = <T extends Type>(type: T, ctor: Fn<any, Term<T>>) => (
    x?: any
): Term<T> | undefined =>
    isNumber(x)
        ? ctor(x)
        : x !== undefined && !isVec(x) && x.type !== type
        ? ctor(x)
        : x;

/**
 * Takes a plain number or numeric term and wraps it as float literal if
 * needed.
 *
 * @param x -
 */
export const wrapFloat = wrap("float", float);

/**
 * Takes a plain number or numeric term and wraps it as signed integer
 * literal if needed.
 *
 * @param x -
 */
export const wrapInt = wrap("int", int);

/**
 * Takes a plain number or numeric term and wraps it as unsigned integer
 * literal if needed.
 *
 * @param x -
 */
export const wrapUint = wrap("uint", uint);

/**
 * Takes a plain number or numeric term and wraps it as boolean literal
 * if needed.
 *
 * @param x -
 */
export const wrapBool = wrap("bool", bool);

export const TRUE = lit("bool", true);
export const FALSE = lit("bool", false);

export const FLOAT0: FloatTerm = float(0);
export const FLOAT1: FloatTerm = float(1);
export const FLOAT2: FloatTerm = float(2);
export const FLOAT05: FloatTerm = float(0.5);

export const INT0: IntTerm = int(0);
export const INT1: IntTerm = int(1);

export const UINT0: UintTerm = uint(0);
export const UINT1: UintTerm = uint(1);

export const PI: FloatTerm = float(Math.PI);
export const TAU: FloatTerm = float(Math.PI * 2);
export const HALF_PI: FloatTerm = float(Math.PI / 2);
export const SQRT2: FloatTerm = float(Math.SQRT2);

const $gvec = (wrap: Fn<any, Term<any> | undefined>, init: Term<any>) => (
    xs: any[]
) => [xs[0] === undefined ? init : wrap(xs[0]), ...xs.slice(1).map(wrap)];

const $vec = $gvec(wrapFloat, FLOAT0);

const $ivec = $gvec(wrapInt, INT0);

const $uvec = $gvec(wrapUint, UINT0);

const $bvec = $gvec(wrapBool, FALSE);

const $gvec2 = <T extends Type>(
    type: T,
    ctor: Fn<any[], (Term<any> | undefined)[]>,
    xs: any[]
) => lit(type, (xs = ctor(xs)), ["n", "n"][xs.length]);

const $gvec3 = <T extends Type>(
    type: T,
    ctor: Fn<any[], (Term<any> | undefined)[]>,
    xs: any[]
) => lit(type, (xs = ctor(xs)), ["n", "n", "vn"][xs.length]);

const $gvec4 = <T extends Type>(
    type: T,
    ctor: Fn<any[], (Term<any> | undefined)[]>,
    xs: any[]
) =>
    lit(
        type,
        (xs = ctor(xs)),
        xs.length === 2
            ? isVec(xs[1])
                ? "vv"
                : "vn"
            : ["n", "n", , "vnn"][xs.length]
    );

const $gmat = <T extends Type>(
    type: T,
    info: (string | undefined)[],
    xs: any[]
) => lit(type, (xs = $vec(xs)), info[xs.length]);

export function vec2(): Lit<"vec2">;
export function vec2(x: NumericF): Lit<"vec2">;
// export function vec2(x: Term<Vec | IVec | BVec>): Lit<"vec2">;
// prettier-ignore
export function vec2(x: NumericF, y: NumericF): Lit<"vec2">;
// prettier-ignore
export function vec2(...xs: any[]): Lit<"vec2"> {
    return $gvec2("vec2", $vec, xs);
}

export function vec3(): Lit<"vec3">;
export function vec3(x: NumericF): Lit<"vec3">;
export function vec3(x: Vec2Term, y: NumericF): Lit<"vec3">;
// prettier-ignore
export function vec3(x: NumericF, y: NumericF, z: NumericF): Lit<"vec3">;
export function vec3(...xs: any[]): Lit<"vec3"> {
    return $gvec3("vec3", $vec, xs);
}

export function vec4(): Lit<"vec4">;
export function vec4(x: NumericF): Lit<"vec4">;
export function vec4(x: Vec3Term, y: NumericF): Lit<"vec4">;
export function vec4(x: Vec2Term, y: Vec2Term): Lit<"vec4">;
// prettier-ignore
export function vec4(x: Vec2Term, y: NumericF, z: NumericF): Lit<"vec4">;
// prettier-ignore
export function vec4(x: NumericF, y: NumericF, z: NumericF, w: NumericF): Lit<"vec4">;
export function vec4(...xs: any[]): Lit<"vec4"> {
    return $gvec4("vec4", $vec, xs);
}

export function ivec2(): Lit<"ivec2">;
export function ivec2(x: NumericI): Lit<"ivec2">;
// prettier-ignore
export function ivec2(x: NumericI, y: NumericI): Lit<"ivec2">;
// prettier-ignore
export function ivec2(...xs: any[]): Lit<"ivec2"> {
    return $gvec2("ivec2", $ivec, xs);
}

export function ivec3(): Lit<"ivec3">;
export function ivec3(x: NumericI): Lit<"ivec3">;
export function ivec3(x: Vec2Term, y: NumericI): Lit<"ivec3">;
// prettier-ignore
export function ivec3(x: NumericI, y: NumericI, z: NumericI): Lit<"ivec3">;
export function ivec3(...xs: any[]): Lit<"ivec3"> {
    return $gvec3("ivec3", $ivec, xs);
}

export function ivec4(): Lit<"ivec4">;
export function ivec4(x: NumericI): Lit<"ivec4">;
export function ivec4(x: Vec3Term, y: NumericI): Lit<"ivec4">;
export function ivec4(x: Vec2Term, y: Vec2Term): Lit<"ivec4">;
// prettier-ignore
export function ivec4(x: Vec2Term, y: NumericI, z: NumericI): Lit<"ivec4">;
// prettier-ignore
export function ivec4(x: NumericI, y: NumericI, z: NumericI, w: NumericI): Lit<"ivec4">;
export function ivec4(...xs: any[]): Lit<"ivec4"> {
    return $gvec4("ivec4", $ivec, xs);
}

export function uvec2(): Lit<"uvec2">;
export function uvec2(x: NumericU): Lit<"uvec2">;
// prettier-ignore
export function uvec2(x: NumericU, y: NumericU): Lit<"uvec2">;
// prettier-ignore
export function uvec2(...xs: any[]): Lit<"uvec2"> {
    return $gvec2("uvec2", $uvec, xs);
}

export function uvec3(): Lit<"uvec3">;
export function uvec3(x: NumericU): Lit<"uvec3">;
export function uvec3(x: Vec2Term, y: NumericU): Lit<"uvec3">;
// prettier-ignore
export function uvec3(x: NumericU, y: NumericU, z: NumericU): Lit<"uvec3">;
export function uvec3(...xs: any[]): Lit<"uvec3"> {
    return $gvec3("uvec3", $uvec, xs);
}

export function uvec4(): Lit<"uvec4">;
export function uvec4(x: NumericU): Lit<"uvec4">;
export function uvec4(x: Vec3Term, y: NumericU): Lit<"uvec4">;
export function uvec4(x: Vec2Term, y: Vec2Term): Lit<"uvec4">;
// prettier-ignore
export function uvec4(x: Vec2Term, y: NumericU, z: NumericU): Lit<"uvec4">;
// prettier-ignore
export function uvec4(x: NumericU, y: NumericU, z: NumericU, w: NumericU): Lit<"uvec4">;
export function uvec4(...xs: any[]): Lit<"uvec4"> {
    return $gvec4("uvec4", $uvec, xs);
}

export function bvec2(): Lit<"bvec2">;
export function bvec2(x: NumericB): Lit<"bvec2">;
// prettier-ignore
export function bvec2(x: NumericB, y: NumericB): Lit<"bvec2">;
// prettier-ignore
export function bvec2(...xs: any[]): Lit<"bvec2"> {
    return $gvec2("bvec2", $bvec, xs);
}

export function bvec3(): Lit<"bvec3">;
export function bvec3(x: NumericB): Lit<"bvec3">;
export function bvec3(x: Vec2Term, y: NumericB): Lit<"bvec3">;
// prettier-ignore
export function bvec3(x: NumericB, y: NumericB, z: NumericB): Lit<"bvec3">;
export function bvec3(...xs: any[]): Lit<"bvec3"> {
    return $gvec3("bvec3", $bvec, xs);
}

export function bvec4(): Lit<"bvec4">;
export function bvec4(x: NumericB): Lit<"bvec4">;
export function bvec4(x: Vec3Term, y: NumericB): Lit<"bvec4">;
export function bvec4(x: Vec2Term, y: Vec2Term): Lit<"bvec4">;
// prettier-ignore
export function bvec4(x: Vec2Term, y: NumericB, z: NumericB): Lit<"bvec4">;
// prettier-ignore
export function bvec4(x: NumericB, y: NumericB, z: NumericB, w: NumericB): Lit<"bvec4">;
export function bvec4(...xs: any[]): Lit<"bvec4"> {
    return $gvec4("bvec4", $bvec, xs);
}

export function mat2(): Lit<"mat2">;
export function mat2(x: NumericF): Lit<"mat2">;
export function mat2(x: Vec2Term, y: Vec2Term): Lit<"mat2">;
// prettier-ignore
export function mat2(a: NumericF, b: NumericF, c: NumericF, d: NumericF): Lit<"mat2">;
export function mat2(...xs: any[]): Lit<"mat2"> {
    return $gmat("mat2", ["n", "n", "vv"], xs);
}

export function mat3(): Lit<"mat3">;
export function mat3(x: NumericF): Lit<"mat3">;
// prettier-ignore
export function mat3(x: Vec3Term, y: Vec3Term, z: Vec3Term): Lit<"mat3">;
// prettier-ignore
export function mat3(a: NumericF, b: NumericF, c: NumericF, d: NumericF, e: NumericF, f: NumericF, g: NumericF, h: NumericF, i: NumericF): Lit<"mat3">;
export function mat3(...xs: any[]): Lit<"mat3"> {
    return $gmat("mat3", ["n", "n", , "vvv"], xs);
}

export function mat4(): Lit<"mat4">;
export function mat4(x: NumericF): Lit<"mat4">;
// prettier-ignore
export function mat4(x: Vec4Term, y: Vec4Term, z: Vec4Term, w: Vec4Term): Lit<"mat4">;
// prettier-ignore
export function mat4(a: NumericF, b: NumericF, c: NumericF, d: NumericF, e: NumericF, f: NumericF, g: NumericF, h: NumericF, i: NumericF, j: NumericF, k: NumericF, l: NumericF, m: NumericF, n: NumericF, o: NumericF, p: NumericF): Lit<"mat4">;
export function mat4(...xs: any[]): Lit<"mat4"> {
    return $gmat("mat4", ["n", "n", , , "vvvv"], xs);
}
