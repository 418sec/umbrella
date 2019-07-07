import { clamp01 } from "@thi.ng/math";
import { dot3, setC3 } from "@thi.ng/vectors";
import { ColorOp, RGB_LUMINANCE } from "./api";
import { hueRgba } from "./hue-rgba";
import { ensureAlpha } from "./internal/ensure-alpha";

export const hcyaRgba: ColorOp = (out, src) => {
    const h = src[0];
    let c = src[1];
    const y = src[2];
    const rgb = hueRgba(out || src, h, ensureAlpha(src[3]));
    const lum = dot3(rgb, RGB_LUMINANCE);
    if (y < lum) {
        c *= y / lum;
    } else if (lum < 1) {
        c *= (1 - y) / (1 - lum);
    }
    return setC3(
        rgb,
        clamp01((rgb[0] - lum) * c + y),
        clamp01((rgb[1] - lum) * c + y),
        clamp01((rgb[2] - lum) * c + y)
    );
};
