import { IGen } from "../api";
import { CompG1 } from "./comp";

/**
 * Creates a new {@link IGen} using given `step` gen and `start
 * (default: 0) value, producing: `y(t) = step(t) + y(t-1)`.
 *
 * @remarks
 * Note this is different to {@link sum}, which merely sums given
 * argument gens for each step, but doesn't for a reduction like this
 * gen.
 *
 * @example
 * ```ts
 * addg(constant(1), 10).take(5)
 * // [ 10, 11, 12, 13, 14 ]
 * ```
 *
 * @param step
 * @param start
 */
export const addg = (step: IGen<number>, start = 0) =>
    new CompG1((a, b) => a + b, step, start - step.deref());