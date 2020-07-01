import type { NumOrString } from "@thi.ng/api";
import type {
    Attribs,
    AttribVal,
    ReferrerAttribs,
    RelAttribs,
    StringAttrib,
} from "./api";
import { defElement, defElements } from "./def";

interface AnchorAttribs extends Attribs, ReferrerAttribs, RelAttribs {
    download: StringAttrib;
    href: StringAttrib;
    hreflang: StringAttrib;
    ping: AttribVal<string | string[]>;
    target: StringAttrib;
    type: StringAttrib;
}

export const anchor = defElement<Partial<AnchorAttribs>>("a");

export const abbr = defElement<{ title: StringAttrib } & Partial<Attribs>>(
    "abbr"
);

export const br = defElement<never, never>("br");

export const data = defElement<
    { value: AttribVal<NumOrString> } & Partial<Attribs>
>("data");

export const quote = defElement<{ cite: StringAttrib } & Partial<Attribs>>("q");

export const time = defElement<{ datetime: StringAttrib } & Partial<Attribs>>(
    "time"
);

export const [
    cite,
    code,
    em,
    i,
    kbd,
    mark,
    small,
    span,
    strong,
    sub,
    sup,
] = defElements([
    "cite",
    "code",
    "em",
    "i",
    "kbd",
    "mark",
    "small",
    "span",
    "strong",
    "sub",
    "sup",
]);

export interface EditAttribs extends Attribs {
    cite: StringAttrib;
    datetime: StringAttrib;
}

export const [del, ins] = defElements<Partial<EditAttribs>>(["del", "ins"]);
