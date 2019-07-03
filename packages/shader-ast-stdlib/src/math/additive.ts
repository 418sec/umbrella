import {
    add,
    assign,
    defn,
    float,
    FLOAT0,
    FLOAT05,
    FloatSym,
    forLoop,
    Func1,
    inc,
    lt,
    mul,
    Prim,
    ret,
    sym
} from "@thi.ng/shader-ast";

/**
 * Higher order function. Takes an AST type ID, a single-arg scalar
 * function `fn`, number of octaves (default: 4) and an optional
 * function name. Returns a new function which computes the summed value
 * of `fn` over the given number octaves and accepts 3 args:
 *
 * - position (float)
 * - octave shift (float)
 * - octave decay (usually 0.5)
 *
 * For each octave `i` [0..oct), the function is (in principle)
 * evaluated as:
 *
 * n += decay / exp2(i) * fn(pos * exp2(i) + i * shift)
 *
 * @param fn
 * @param oct
 * @param name
 */
export const additive = <T extends Prim>(
    type: T,
    fn: Func1<T, "float">,
    oct = 4,
    name = "additive"
) =>
    defn("float", name, [[type], [type], ["float"]], (pos, shift, decay) => {
        let n: FloatSym;
        let amp: FloatSym;
        return [
            (n = sym(FLOAT0)),
            (amp = sym(FLOAT05)),
            forLoop(
                sym("float", float(0)),
                (i) => lt(i, float(oct)),
                inc,
                (i) => [
                    assign(
                        n,
                        add(
                            n,
                            mul(amp, fn(<any>add(<any>pos, mul(i, <any>shift))))
                        )
                    ),
                    assign(amp, mul(amp, decay)),
                    assign(pos, <any>mul(<any>pos, 2))
                ]
            ),
            ret(n)
        ];
    });
