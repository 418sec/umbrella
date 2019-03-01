import { compile, set as _set, SET, set4 } from "@thi.ng/vectors";
import { MatOpM } from "./api";

const $ = (dim) => _set.add(dim, compile(dim, SET, "o,a"));

export const set: MatOpM = _set;
export const set22: MatOpM = set4;
export const set23: MatOpM = $(6);
export const set33: MatOpM = $(9);
export const set44: MatOpM = $(16);
