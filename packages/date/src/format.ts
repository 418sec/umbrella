import { DAY, FormatFn, HOUR, MINUTE, SECOND } from "./api";
import { DateTime } from "./datetime";
import { LOCALE } from "./i18n";

const Z2 = (x: number) => (x < 10 ? "0" + x : String(x));

export const FORMATTERS: Record<string, FormatFn> = {
    /**
     * Full year (4 digits)
     */
    yyyy: (d) => String(d.getFullYear()),
    /**
     * Short year (2 digits, e.g. `2020 % 100` => 20)
     */
    yy: (d) => String(d.getFullYear() % 100),
    /**
     * 3-letter month name (e.g. `Feb`)
     */
    MMM: (d) => LOCALE.months[d.getMonth()],
    /**
     * Zero-padded 2-digit month
     */
    MM: (d) => Z2(d.getMonth() + 1),
    /**
     * Unpadded month
     */
    M: (d) => String(d.getMonth() + 1),
    /**
     * Zero-padded 2-digit day of month
     */
    dd: (d) => Z2(d.getDate()),
    /**
     * Unpadded day of month
     */
    d: (d) => String(d.getDate()),
    /**
     * 3-letter weekday name (e.g. `Mon`)
     */
    E: (d) => LOCALE.days[d.getDay()],
    /**
     * Zero-padded 2-digit hour of day (0-23)
     */
    HH: (d) => Z2(d.getHours()),
    /**
     * Zero-padded hour of day (1-12)
     */
    hh: (d) => {
        const h = d.getHours() % 12;
        return Z2(h > 0 ? h : 12);
    },
    /**
     * Unpadded hour of day (1-12)
     */
    h: (d) => {
        const h = d.getHours() % 12;
        return String(h > 0 ? h : 12);
    },
    /**
     * Zero-padded 2-digit minute of hour
     */
    mm: (d) => Z2(d.getMinutes()),
    /**
     * Unpadded minute of hour
     */
    m: (d) => String(d.getMinutes()),
    /**
     * Zero-padded 2-digit second of minute
     */
    ss: (d) => Z2(d.getSeconds()),
    /**
     * Unpadded second of minute
     */
    s: (d) => String(d.getSeconds()),
    /**
     * Unpadded millisecond of second
     */
    S: (d) => String(d.getMilliseconds()),
    /**
     * 12-hour AM/PM marker
     */
    A: (d) => String(d.getHours() < 12 ? "AM" : "PM"),
    /**
     * Timezone offset in signed `HH:mm` format
     */
    Z: (d) => {
        const z = d.getTimezoneOffset();
        const za = Math.abs(z);
        return `${z < 0 ? "-" : "+"}${Z2((za / 60) | 0)}:${Z2(za % 60)}`;
    },
};

/**
 * Returns a new date formatter for given array of format strings (or
 * functions). The returned function accepts timestamps (epoch), `Date` or
 * `DateTime` instances and accepts an optional boolean arg to output UTC
 * instead of local time (default).
 *
 * @remarks
 * See {@link FORMATTERS} for available date component format IDs.
 *
 * @example
 * ```ts
 * const fmt = defFormat(["yyyy", "-", "MM", "-", "dd"]);
 *
 * fmt(new Date(2015, 3, 23))
 * // 2015-04-23
 * ```
 *
 * @param fmt
 */
export const defFormat = (fmt: (string | FormatFn)[]) => (
    x: DateTime | Date | number,
    utc = false
) => {
    let d =
        typeof x === "number"
            ? new Date(x)
            : x instanceof DateTime
            ? x.toDate()
            : x;
    utc && (d = new Date(d.getTime() + d.getTimezoneOffset() * MINUTE));
    return fmt
        .map((x) => {
            let fmt: FormatFn;
            return typeof x === "string"
                ? (fmt = FORMATTERS[x])
                    ? fmt(d)
                    : x
                : typeof x === "function"
                ? x(d)
                : x;
        })
        .join("");
};

/**
 * Format preset, e.g. `2020-09-19`
 */
export const FMT_yyyyMMdd = defFormat(["yyyy", "-", "MM", "-", "dd"]);
/**
 * Format preset, e.g. `9/19/2020`
 */
export const FMT_Mdyyyy = defFormat(["M", "/", "d", "/", "yyyy"]);
/**
 * Format preset, e.g. `Sep 19 2020`. Uses current `LOCALE`, see
 * {@link setLocale}.
 */
export const FMT_MMMdyyyy = defFormat(["MMM", " ", "d", " ", "yyyy"]);
/**
 * Format preset, e.g. `19/9/2020`
 */
export const FMT_dMyyyy = defFormat(["d", "/", "M", "/", "yyyy"]);
/**
 * Format preset, e.g. `19 Sep 2020`
 */
export const FMT_dMMMyyyy = defFormat(["d", " ", "MMM", " ", "yyyy"]);
/**
 * Format preset, e.g. `17:08`
 */
export const FMT_HHmm = defFormat(["HH", ":", "mm"]);
/**
 * Format preset, e.g. `5:08 PM`
 */
export const FMT_hm = defFormat(["h", ":", "mm", " ", "A"]);
/**
 * Format preset, e.g. `17:08:01`
 */
export const FMT_HHmmss = defFormat(["HH", ":", "mm", ":", "ss"]);
/**
 * Format preset, e.g. `5:08:01 PM`
 */
export const FMT_hms = defFormat(["h", ":", "mm", ":", "ss", " ", "A"]);
/**
 * Format preset, e.g. `20200919-170801`
 */
// prettier-ignore
export const FMT_yyyyMMdd_HHmmss = defFormat(["yyyy", "MM", "dd", "-", "HH", "mm", "ss"]);
