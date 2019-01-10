import {
    cross3,
    dot3,
    mag,
    normalize as _normalize,
    ReadonlyVec
} from "@thi.ng/vectors3";
import { quatFromAxisAngle } from "./quat-axis-angle";

export const alignmentQuat =
    (from: ReadonlyVec, to: ReadonlyVec, normalize = true) => {
        if (normalize) {
            from = _normalize([], from);
            to = _normalize([], to);
        }
        const axis = cross3([], from, to);
        return quatFromAxisAngle(
            axis,
            Math.atan2(mag(axis), dot3(from, to))
        )
    };
