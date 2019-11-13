import {
    $x,
    $y,
    FloatTerm,
    mul,
    sub,
    Vec2Term
} from "@thi.ng/shader-ast";

/**
 * Inline function. Computes 2D cross product of given vectors.
 *
 * @see crossC2
 *
 * @param a -
 * @param b -
 */
export const cross2 = (a: Vec2Term, b: Vec2Term) =>
    crossC2($x(a), $y(a), $x(b), $y(b));

/**
 * Inline function. Computes 2D cross product of given individual
 * components: ax * by - ay * bx
 *
 * @param ax -
 * @param ay -
 * @param bx -
 * @param by -
 */
export const crossC2 = (
    ax: FloatTerm,
    ay: FloatTerm,
    bx: FloatTerm,
    by: FloatTerm
) => sub(mul(ax, by), mul(ay, bx));
