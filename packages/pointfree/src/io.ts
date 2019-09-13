import { StackContext } from "./api";
import { $ } from "./safe";

//////////////////// I/O  ////////////////////

/**
 * Prints TOS to console
 *
 * ( x -- )
 *
 * @param ctx
 */
export const print = (ctx: StackContext) => (
    $(ctx[0], 1), console.log(ctx[0].pop()), ctx
);

export const printds = (ctx: StackContext) => (console.log(ctx[0]), ctx);

export const printrs = (ctx: StackContext) => (console.log(ctx[1]), ctx);
