import { memoize1 } from "@thi.ng/memoize";
import { HtmlFormatOpts, StringFormat } from "./api";

/**
 * Constructs an HTML formatter using given config options.
 *
 * @param opts
 */
export const formatHtml = ({
    colors,
    attrib,
    delim,
    fg,
    bg,
    bold,
    dim,
    underline
}: HtmlFormatOpts): StringFormat => ({
    start: memoize1((x: number) => {
        let y = x & 0xf;
        let res = `<span ${attrib}="${fg}${
            colors[(y - 1) | ((x >> 1) & 0x8)]
        }${delim}`;
        y = (x >> 5) & 0x0f;
        y && (res += `${bg}${colors[(y - 1) | ((x >> 6) & 0x8)]}${delim}`);
        x & 0x400 && (res += bold + delim);
        x & 0x800 && (res += dim + delim);
        x & 0x1000 && (res += underline + delim);
        return res + '">';
    }),
    end: "</span>",
    prefix: "",
    suffix: "<br/>"
});

/**
 * Preset HTML string formatter, generating `<span>` elements with
 * inline CSS.
 */
export const FMT_HTML_INLINE_CSS = formatHtml({
    colors: [
        "#000",
        "#a00",
        "#0a0",
        "#aa0",
        "#00a",
        "#a0a",
        "#0aa",
        "#aaa",
        "#555",
        "#f55",
        "#5f5",
        "#ff5",
        "#55f",
        "#f5f",
        "#5ff",
        "#fff"
    ],
    attrib: "style",
    delim: ";",
    fg: "color:",
    bg: "background:",
    bold: "font-weight:bold",
    dim: "opacity:0.5",
    underline: "text-decoration:underline"
});

/**
 * Preset HTML formatter, generating `<span>` elements with Tachyons CSS
 * classes.
 */
export const FMT_HTML_TACHYONS = formatHtml({
    colors: [
        "black",
        "dark-red",
        "dark-green",
        "gold",
        "dark-blue",
        "dark-pink",
        "light-blue",
        "moon-gray",
        "mid-gray",
        "red",
        "green",
        "yellow",
        "blue",
        "hot-pink",
        "lightest-blue",
        "white"
    ],
    attrib: "class",
    delim: " ",
    fg: "",
    bg: "bg-",
    bold: "b",
    dim: "o-50",
    underline: "underline"
});
