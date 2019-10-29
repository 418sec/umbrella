import { VecOpSVVV } from "./api";
import { ARGS_VVV, defOpS, SARGS_VVV } from "./internal/codegen";
import { MATH2 } from "./internal/templates";

export const [submS2, submS3, submS4] = defOpS<VecOpSVVV>(
    MATH2("-", "*"),
    `${ARGS_VVV},${SARGS_VVV}`,
    ARGS_VVV
);
