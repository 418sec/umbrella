import { IntersectionResult, IntersectionType } from "@thi.ng/geom-api";
import { closestPointSegment } from "@thi.ng/geom-closest-point";
import { EPS, eqDeltaFixed } from "@thi.ng/math";
import { mixN2, ReadonlyVec } from "@thi.ng/vectors";

export const intersectLineLine = (
    a: ReadonlyVec,
    b: ReadonlyVec,
    c: ReadonlyVec,
    d: ReadonlyVec,
    eps = EPS
): IntersectionResult => {
    const bax = b[0] - a[0];
    const bay = b[1] - a[1];
    const dcx = d[0] - c[0];
    const dcy = d[1] - c[1];
    const acx = a[0] - c[0];
    const acy = a[1] - c[1];
    const det = dcy * bax - dcx * bay;
    let alpha = dcx * acy - dcy * acx;
    let beta = bax * acy - bay * acx;
    if (eqDeltaFixed(det, 0, eps)) {
        if (eqDeltaFixed(alpha, 0, eps) && eqDeltaFixed(beta, 0, eps)) {
            let isec =
                closestPointSegment(c, a, b, undefined, true) ||
                closestPointSegment(d, a, b, undefined, true);
            return {
                type: isec
                    ? IntersectionType.COINCIDENT
                    : IntersectionType.COINCIDENT_NO_INTERSECT,
                isec
            };
        }
        return { type: IntersectionType.PARALLEL };
    }
    alpha /= det;
    beta /= det;
    const ieps = 1 - eps;
    return {
        type:
            eps < alpha && alpha < ieps && (eps < beta && beta < ieps)
                ? IntersectionType.INTERSECT
                : IntersectionType.INTERSECT_OUTSIDE,
        isec: mixN2([], a, b, alpha),
        alpha,
        beta,
        det
    };
};

/**
 * 2D only. Returns true if line `a`,`b` is parallel (or coincident) to
 * line `c`,`d`.
 *
 * @param a -
 * @param b -
 * @param c -
 * @param d -
 */
export const isParallelLine = (
    a: ReadonlyVec,
    b: ReadonlyVec,
    c: ReadonlyVec,
    d: ReadonlyVec
) =>
    eqDeltaFixed(
        (d[1] - c[1]) * (b[0] - a[0]) - (d[0] - c[0]) * (b[1] - a[1]),
        0
    );
