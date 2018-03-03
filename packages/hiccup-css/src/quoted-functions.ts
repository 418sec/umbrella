import { at_import } from "./import";
import { at_keyframes } from "./keyframes";
import { at_media } from "./media";
import { at_namespace } from "./namespace";
import { at_supports } from "./supports";

export const QUOTED_FNS = {
    "@import": at_import,
    "@keyframes": at_keyframes,
    "@media": at_media,
    "@namespace": at_namespace,
    "@supports": at_supports,
};
