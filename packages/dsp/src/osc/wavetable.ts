import { fract, mix as _mix } from "@thi.ng/math";
import type { Fn3, NumericArray } from "@thi.ng/api";
import type { StatelessOscillator } from "../api";

export const wavetable = (
    table: NumericArray,
    interpolate: Fn3<number, number, number, number> = _mix
): StatelessOscillator => {
    const n = table.length;
    const n1 = n - 1;
    return (phase, freq, amp = 1, dc = 0) => {
        phase = fract(phase * freq) * n;
        let i = phase | 0;
        let j = i < n1 ? i + 1 : 0;
        return dc + amp * interpolate(table[i], table[j], phase - i);
    };
};
