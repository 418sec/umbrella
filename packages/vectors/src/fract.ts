import { fract as _fract } from "@thi.ng/math";
import { MultiVecOpV, VecOpV } from "./api";
import { defHofOp } from "./internal/codegen";

export const [fract, fract2, fract3, fract4] =
    defHofOp<MultiVecOpV, VecOpV>(_fract);
