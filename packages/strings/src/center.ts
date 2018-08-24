import { memoizeJ } from "@thi.ng/memoize/memoizej";

import { Stringer } from "./api";
import { repeat } from "./repeat";
import { truncate } from "./truncate";

/**
 * Returns stringer which pads given input with `ch` (default: space) on
 * both sides and returns fixed width string of given `lineWidth`.
 * Returns string of only pad characters for any `null` or `undefined`
 * values. If the string version of an input is > `lineWidth`, no
 * centering is performed, but the string will be truncated to
 * `lineWidth`.
 *
 * Note: The padding string can contain multiple characters.
 *
 * ```
 * center(20, "<>")(wrap(" ")("thi.ng"))
 * // "<><><> thi.ng <><><>"
 * ```
 *
 * @param lineWidth target length
 * @param ch pad character(s)
 */
export const center: (lineWidth: number, ch?: string | number) => Stringer<any> =
    memoizeJ<number, string, Stringer<any>>((n, ch = " ") => {
        const buf = repeat(ch, n);
        return (x: any) => {
            if (x == null) return buf;
            x = x.toString();
            const r = (n - x.length) / 2;
            return x.length < n ?
                buf.substr(0, r) + x + buf.substr(0, r + ((n & 1) === (x.length & 1) ? 0 : 1)) :
                truncate(n)(x);
        }
    });
