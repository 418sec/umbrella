import { U16BE, U32BE, U48BE } from "@thi.ng/hex";

/**
 * Returns UUID formatted string of given byte array from optional start index
 * `i` (default: 0). Array must have min. length 16.
 *
 * @remarks
 * Use {@link @thi.ng/random#uuid} to also generate an UUID from scratch (rather
 * than just format one).
 *
 * @param id -
 * @param i -
 */
export const uuid = (id: ArrayLike<number>, i = 0) =>
    // prettier-ignore
    `${U32BE(id, i)}-${U16BE(id, i + 4)}-${U16BE(id, i + 6)}-${U16BE(id, i + 8)}-${U48BE(id, i + 10)}`;
