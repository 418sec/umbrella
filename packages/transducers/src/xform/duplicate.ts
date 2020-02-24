import { compR } from "../func/compr";
import { iterator } from "../iterator";
import { isReduced } from "../reduced";
import type { Reducer, Transducer } from "../api";

export function duplicate<T>(n?: number): Transducer<T, T>;
export function duplicate<T>(n: number, src: Iterable<T>): IterableIterator<T>;
export function duplicate<T>(n = 1, src?: Iterable<T>): any {
    return src
        ? iterator(duplicate(n), src)
        : (rfn: Reducer<any, T>) => {
              const r = rfn[2];
              return compR(rfn, (acc, x: T) => {
                  for (let i = n; i >= 0 && !isReduced(acc); i--) {
                      acc = r(acc, x);
                  }
                  return acc;
              });
          };
}
