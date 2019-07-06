import {
    $x,
    $xy,
    $xyz,
    IntTerm,
    IVec2Term,
    texture
} from "@thi.ng/shader-ast";
import { Sampler2DTerm } from "@thi.ng/shader-ast/api";
import { indexToUV } from "./index-uv";

/**
 * Inline function. Returns x component at index `i` in `tex`.
 *
 * @param tex
 * @param i
 * @param size
 */
export const readIndex1 = (tex: Sampler2DTerm, i: IntTerm, size: IVec2Term) =>
    $x(texture(tex, indexToUV(i, size)));

/**
 * Inline function. Returns vec2 (x,y components) at index `i` in `tex`.
 *
 * @param tex
 * @param i
 * @param size
 */
export const readIndex2 = (tex: Sampler2DTerm, i: IntTerm, size: IVec2Term) =>
    $xy(texture(tex, indexToUV(i, size)));

/**
 * Inline function. Returns vec3 (x,y,z components) at index `i` in `tex`.
 *
 * @param tex
 * @param i
 * @param size
 */
export const readIndex3 = (tex: Sampler2DTerm, i: IntTerm, size: IVec2Term) =>
    $xyz(texture(tex, indexToUV(i, size)));

/**
 * Inline function. Returns vec4 at index `i` in `tex`.
 *
 * @param tex
 * @param i
 * @param size
 */
export const readIndex4 = (tex: Sampler2DTerm, i: IntTerm, size: IVec2Term) =>
    texture(tex, indexToUV(i, size));
