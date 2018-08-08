import { Reducer, Transducer } from "../api";
import { compR } from "../func/compr";
import { iterator } from "../iterator";
import { isReduced } from "../reduced";

export function interleave<A, B>(sep: B | (() => B)): Transducer<A, A | B>;
export function interleave<A, B>(sep: B | (() => B), src: Iterable<A>): IterableIterator<A | B>;
export function interleave<A, B>(sep: B | (() => B), src?: Iterable<A>): any {
    return src ?
        iterator(interleave(sep), src) :
        (rfn: Reducer<any, A | B>) => {
            const r = rfn[2];
            const _sep = typeof sep === "function" ? sep : () => sep;
            return compR(rfn,
                (acc, x: A) => {
                    acc = r(acc, _sep());
                    return isReduced(acc) ? acc : r(acc, x);
                });
        };
}
