import { IObjectOf } from "@thi.ng/api/api";
import { isArray } from "@thi.ng/checks/is-array";

import { Reducer, Transducer } from "../api";
import { comp } from "../func/comp";
import { renamer } from "../func/renamer";
import { $iter } from "../iterator";
import { transduce } from "../transduce";
import { filter } from "./filter";
import { map } from "./map";

export function rename<A, B>(kmap: IObjectOf<PropertyKey> | Array<PropertyKey>, rfn?: Reducer<B, [PropertyKey, A]>): Transducer<A[], B>;
export function rename<A, B>(kmap: IObjectOf<PropertyKey> | Array<PropertyKey>, src: Iterable<A[]>): IterableIterator<B>;
export function rename<A, B>(kmap: IObjectOf<PropertyKey> | Array<PropertyKey>, rfn: Reducer<B, [PropertyKey, A]>, src: Iterable<A[]>): IterableIterator<B>;
export function rename(...args: any[]): any {
    const iter = $iter(rename, args);
    if (iter) {
        return iter;
    }
    let kmap;
    if (isArray(args[0])) {
        kmap = args[0].reduce((acc, k, i) => (acc[k] = i, acc), {});
    }
    if (args[1]) {
        const ks = Object.keys(kmap);
        return map(
            (y) => transduce(
                comp(
                    map((k: PropertyKey) => [k, y[kmap[k]]]),
                    filter(x => x[1] !== undefined)
                ),
                args[1], ks
            )
        );
    } else {
        return map(renamer(<IObjectOf<PropertyKey>>kmap));
    }
}
