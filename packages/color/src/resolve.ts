import { isArrayLike, isNumber, isString } from "@thi.ng/checks";
import type { ReadonlyColor } from "./api";
import { asCSS } from "./convert";

/**
 * Takes a color in one of the following formats and tries to convert it
 * to a CSS string:
 *
 * - any IColor instance
 * - raw RGBA vector
 * - number ((A)RGB int)
 * - string (unchanged)
 *
 * @param col - source color
 */
export const resolveAsCSS = (col: any) =>
    isArrayLike(col)
        ? isString((<any>col).mode)
            ? asCSS(<any>col)
            : asCSS(<ReadonlyColor>col, "rgb")
        : isNumber(col)
        ? asCSS(col, "int")
        : col;
