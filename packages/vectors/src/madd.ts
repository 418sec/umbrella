import { MultiVecOpVVV, VecOpVVV } from "./api";
import { ARGS_VVV, defOp } from "./internal/codegen";
import { MATH2 } from "./internal/templates";

/**
 * Returns `out = a * b + c`.
 *
 * @see addm
 * @see maddN
 *
 * @param out
 * @param a
 * @param b
 * @param c
 */
export const [madd, madd2, madd3, madd4] = defOp<MultiVecOpVVV, VecOpVVV>(
    MATH2("*", "+"),
    ARGS_VVV
);
