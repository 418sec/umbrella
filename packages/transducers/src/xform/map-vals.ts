import { Fn, IObjectOf } from "@thi.ng/api/api";

import { Transducer } from "../api";
import { $iter } from "../iterator";
import { map } from "./map";

/**
 * Transducer. Similar to `map`, but expects object values and the given
 * function `fn` is applied to each enumerable property value and the
 * results reassigned to their original keys. By default, a shallow copy
 * of the source object is created. The resulting object is then used as
 * the result of this transducer.
 *
 * ```
 * [...mapVals((x)=> x * 10, [{a: 1, b: 2}, {c: 3, d: 4}])]
 * // [ { a: 10, b: 20 }, { c: 30, d: 40 } ]
 * ```
 *
 * @param fn
 * @param copy if true (default), creates a shallow copy of each incoming value
 */
export function mapVals<A, B>(fn: Fn<A, B>, copy?: boolean): Transducer<IObjectOf<A>, IObjectOf<B>>;
export function mapVals<A, B>(fn: Fn<A, B>, src: Iterable<IObjectOf<A>>): IterableIterator<IObjectOf<B>>;
export function mapVals<A, B>(fn: Fn<A, B>, copy: boolean, src: Iterable<IObjectOf<A>>): IterableIterator<IObjectOf<B>>;
export function mapVals<A, B>(...args: any[]): any {
    const iter = $iter(mapVals, args);
    if (iter) {
        return iter;
    }
    const fn: Fn<A, B> = args[0];
    const copy = args[1] !== false;
    return map((x) => {
        const res: any = copy ? {} : x;
        for (let k in x) {
            res[k] = fn(x[k]);
        }
        return <any>res;
    });
}
