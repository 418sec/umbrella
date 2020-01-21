import { HALF_PI } from "@thi.ng/math";

/**
 * Reference:
 * - {@link https://en.wikipedia.org/wiki/Gibbs_phenomenon}
 * - {@link http://www.musicdsp.org/files/bandlimited.pdf}
 *
 * Interactive graph:
 * {@link https://www.desmos.com/calculator/irugw6gnhy}
 *
 * @param n - number of octaves
 * @param i - curr octave [1..n]
 */
export const gibbs = (n: number, i: number) =>
    Math.cos(((i - 1) * HALF_PI) / n) ** 2;

/**
 * Fejér weight for `k`-th harmonic in a Fourier series of length `n`.
 *
 * @remarks
 * Used for attenuating the {@link gibbs} factor when summing a Fourier
 * series. Linearly attentuates higher harmonics, with the first bin
 * receiving a weight on 1 and the last bin `1/n`.
 *
 * @param k -
 * @param n -
 */
export const fejer = (k: number, n: number) => (n - k) / n;

/**
 * Polynomial attenuation to create bandlimited version of a signal.
 *
 * - {@link http://research.spa.aalto.fi/publications/papers/smc2010-phaseshaping/}
 * - {@link http://www.kvraudio.com/forum/viewtopic.php?t=375517}
 *
 * @param dt - time step
 * @param t - normalized phase
 */
export const polyBLEP = (dt: number, t: number) =>
    t < dt
        ? ((t /= dt), t + t - t * t - 1)
        : t > 1 - dt
        ? ((t = (t - 1) / dt), t * t + t + t + 1)
        : 0;
