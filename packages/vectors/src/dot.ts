import { MultiVecOpRoVV } from "./api";
import { compile, compileG } from "./internal/codegen";
import { DOT, DOT_G } from "./internal/templates";
import { vop } from "./internal/vop";

const $ = (dim: number) =>
    dot.add(
        dim,
        compile(
            dim,
            DOT,
            "a,b",
            undefined,
            null,
            "+",
            "return ",
            ";"
        )
    );

export const dot: MultiVecOpRoVV<number> = vop();

dot.default(
    compileG(DOT_G, "a,b", undefined, "s", "let s=0;")
);

export const dot2 = $(2);
export const dot3 = $(3);
export const dot4 = $(4);
