import type {
    Attribs,
    AttribVal,
    BooleanAttrib,
    CORSAttribs,
    DimensionAttribs,
    ImportanceAttribs,
    LoadingAttribs,
    ReferrerAttribs,
    StringAttrib,
} from "./api";
import { defElement } from "./def";

export interface CanvasAttribs extends Attribs, DimensionAttribs {}

export const canvas = defElement<Partial<CanvasAttribs>>("canvas");

export interface ImageAttribs
    extends Attribs,
        CORSAttribs,
        DimensionAttribs,
        ImportanceAttribs,
        LoadingAttribs,
        ReferrerAttribs {
    alt: StringAttrib;
    decoding: AttribVal<"sync" | "async" | "auto">;
    ismap: BooleanAttrib;
    sizes: AttribVal<string | string[]>;
    src: StringAttrib;
    srcset: AttribVal<string | string[]>;
    usemap: BooleanAttrib;
}

export const img = defElement<Partial<ImageAttribs>, never>("img");

export const picture = defElement("picture");

export interface SourceAttribs extends Attribs {
    media: StringAttrib;
    src: StringAttrib;
    sizes: AttribVal<string | string[]>;
    srcset: AttribVal<string | string[]>;
    type: StringAttrib;
}

export const source = defElement<Partial<SourceAttribs>, never>("source");

export interface AudioAttribs extends Attribs, CORSAttribs {
    autoplay: BooleanAttrib;
    controls: BooleanAttrib;
    disableRemotePlayback: BooleanAttrib;
    loop: BooleanAttrib;
    muted: BooleanAttrib;
    preload: AttribVal<"none" | "preload" | "auto">;
    src: StringAttrib;
}

export const audio = defElement<Partial<AudioAttribs>>("audio");

export interface VideoAttribs extends AudioAttribs, DimensionAttribs {
    autoPictureInPicture: BooleanAttrib;
    controlslist: AttribVal<"nodownload" | "nofullscreen" | "noremoteplayback">;
    disablePictureInPicture: BooleanAttrib;
    playsinline: BooleanAttrib;
    poster: StringAttrib;
}

export const video = defElement<Partial<VideoAttribs>>("video");
