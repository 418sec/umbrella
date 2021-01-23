import type { FnU2, Tuple } from "@thi.ng/api";
import type { IRandom } from "@thi.ng/random";
import type { ReadonlyVec, Vec } from "@thi.ng/vectors";

export type ColorMode =
    | "css"
    | "hcy"
    | "hsi"
    | "hsl"
    | "hsv"
    | "int"
    | "oklab"
    | "rgb"
    | "xyz"
    | "ycbcr";

export type CSSColorName =
    | "aliceblue"
    | "antiquewhite"
    | "aqua"
    | "aquamarine"
    | "azure"
    | "beige"
    | "bisque"
    | "black"
    | "blanchedalmond"
    | "blue"
    | "blueviolet"
    | "brown"
    | "burlywood"
    | "cadetblue"
    | "chartreuse"
    | "chocolate"
    | "coral"
    | "cornflowerblue"
    | "cornsilk"
    | "crimson"
    | "cyan"
    | "darkblue"
    | "darkcyan"
    | "darkgoldenrod"
    | "darkgray"
    | "darkgreen"
    | "darkgrey"
    | "darkkhaki"
    | "darkmagenta"
    | "darkolivegreen"
    | "darkorange"
    | "darkorchid"
    | "darkred"
    | "darksalmon"
    | "darkseagreen"
    | "darkslateblue"
    | "darkslategray"
    | "darkslategrey"
    | "darkturquoise"
    | "darkviolet"
    | "deeppink"
    | "deepskyblue"
    | "dimgray"
    | "dimgrey"
    | "dodgerblue"
    | "firebrick"
    | "floralwhite"
    | "forestgreen"
    | "fuchsia"
    | "gainsboro"
    | "ghostwhite"
    | "gold"
    | "goldenrod"
    | "gray"
    | "grey"
    | "green"
    | "greenyellow"
    | "honeydew"
    | "hotpink"
    | "indianred"
    | "indigo"
    | "ivory"
    | "khaki"
    | "lavender"
    | "lavenderblush"
    | "lawngreen"
    | "lemonchiffon"
    | "lightblue"
    | "lightcoral"
    | "lightcyan"
    | "lightgoldenrodyellow"
    | "lightgray"
    | "lightgreen"
    | "lightgrey"
    | "lightpink"
    | "lightsalmon"
    | "lightseagreen"
    | "lightskyblue"
    | "lightslategray"
    | "lightslategrey"
    | "lightsteelblue"
    | "lightyellow"
    | "lime"
    | "limegreen"
    | "linen"
    | "magenta"
    | "maroon"
    | "mediumaquamarine"
    | "mediumblue"
    | "mediumorchid"
    | "mediumpurple"
    | "mediumseagreen"
    | "mediumslateblue"
    | "mediumspringgreen"
    | "mediumturquoise"
    | "mediumvioletred"
    | "midnightblue"
    | "mintcream"
    | "mistyrose"
    | "moccasin"
    | "navajowhite"
    | "navy"
    | "oldlace"
    | "olive"
    | "olivedrab"
    | "orange"
    | "orangered"
    | "orchid"
    | "palegoldenrod"
    | "palegreen"
    | "paleturquoise"
    | "palevioletred"
    | "papayawhip"
    | "peachpuff"
    | "peru"
    | "pink"
    | "plum"
    | "powderblue"
    | "purple"
    | "red"
    | "rosybrown"
    | "royalblue"
    | "saddlebrown"
    | "salmon"
    | "sandybrown"
    | "seagreen"
    | "seashell"
    | "sienna"
    | "silver"
    | "skyblue"
    | "slateblue"
    | "slategray"
    | "slategrey"
    | "snow"
    | "springgreen"
    | "steelblue"
    | "tan"
    | "teal"
    | "thistle"
    | "tomato"
    | "turquoise"
    | "violet"
    | "wheat"
    | "white"
    | "whitesmoke"
    | "yellow"
    | "yellowgreen";

export type ColorRangePreset =
    | "light"
    | "dark"
    | "bright"
    | "weak"
    | "neutral"
    | "fresh"
    | "soft"
    | "hard"
    | "warm"
    | "cool"
    | "intense";

export type CosineGradientPreset =
    | "blue-cyan"
    | "blue-magenta-orange"
    | "blue-white-red"
    | "cyan-magenta"
    | "green-blue-orange"
    | "green-cyan"
    | "green-magenta"
    | "green-red"
    | "heat1"
    | "magenta-green"
    | "orange-blue"
    | "orange-magenta-blue"
    | "purple-orange-cyan"
    | "rainbow1"
    | "rainbow2"
    | "rainbow3"
    | "rainbow4"
    | "red-blue"
    | "yellow-green-blue"
    | "yellow-magenta-cyan"
    | "yellow-purple-magenta"
    | "yellow-red";

export type Color = Vec;
export type ReadonlyColor = ReadonlyVec;

/**
 * A 4x5 matrix in column-major order
 */
export type ColorMatrix = Tuple<number, 20>;

export type CosCoeffs = Tuple<number, 4>;
export type CosGradientSpec = Tuple<CosCoeffs, 4>;

export type ColorConversion<T> = (out: Color, src: T) => Color;
export type ColorOp = (out: Color | null, src: ReadonlyColor) => Color;

export type ColorDistance = FnU2<ReadonlyColor, number>;

export interface IColor {
    readonly mode: ColorMode;
}

export type Range = [number, number];

export interface ColorRange {
    /**
     * Hue ranges
     */
    h?: Range[];
    /**
     * Saturation ranges
     */
    s?: Range[];
    /**
     * Brightness ranges
     */
    v?: Range[];
    /**
     * Alpha ranges
     */
    a?: Range[];
    /**
     * Black point ranges
     */
    b?: Range[];
    /**
     * White point ranges
     */
    w?: Range[];
}

export interface ColorRangeOpts {
    /**
     * Nunber of result colors.
     *
     * @defaultValue ∞
     */
    num: number;
    /**
     * Max. normalized & randomized hue shift for result colors. Only used if a
     * base color is given.
     *
     * @defaultValue 0.025
     */
    variance: number;
    /**
     * Tolerance for grayscale check (used for both saturation and brightness).
     *
     * @defaultValue 0.001
     */
    eps: number;
    /**
     * PRNG instance to use for randomized values
     *
     * @defaultValue {@link @thi.ng/random#SYSTEM}
     */
    rnd: IRandom;
}

export interface ColorThemePart {
    /**
     * Color range spec to use
     */
    range?: ColorRange | ColorRangePreset;
    /**
     * HSV(A) base color
     */
    base?: ReadonlyColor | CSSColorName;
    /**
     * Relative weight of this theme part
     *
     * @defaultValue 1.0
     */
    weight?: number;
}

export type ColorThemePartTuple =
    | [ColorRangePreset, CSSColorName, number?]
    | [ColorRangePreset | CSSColorName, number?]
    | ColorRangePreset
    | CSSColorName;
