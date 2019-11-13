import { Reducer, Transducer } from "@thi.ng/transducers";
import { isReduced } from "@thi.ng/transducers";
import { Subscription } from "../subscription";

/**
 * Returns a promise which subscribes to given input and transforms
 * incoming values using given transducer `xform` and reducer `rfn`.
 * Once the input is done the promise will resolve with the final
 * reduced result (or fail with error).
 *
 * ```ts
 * rs.transduce(
 *   rs.fromIterable(tx.range(10)),
 *   tx.map((x) => x * 10),
 *   tx.add()
 * ).then((x) => console.log("result", x))
 *
 * // result 450
 * ```
 *
 * @param src -
 * @param xform -
 * @param rfn -
 * @param init -
 */
export const transduce = <A, B, C>(
    src: Subscription<any, A>,
    xform: Transducer<A, B>,
    rfn: Reducer<C, B>,
    init?: C
): Promise<C> => {
    let acc = init !== undefined ? init : rfn[0]();
    let sub: Subscription<A, B>;

    return new Promise<C>((resolve, reject) => {
        sub = src.subscribe(
            {
                next(x) {
                    const _acc = rfn[2](acc, x);
                    if (isReduced(_acc)) {
                        resolve(_acc.deref());
                    } else {
                        acc = _acc;
                    }
                },
                done() {
                    resolve(acc);
                },
                error(e) {
                    reject(e);
                }
            },
            xform
        );
    }).then(
        (fulfilled) => {
            sub.unsubscribe();
            return fulfilled;
        },
        (rejected) => {
            sub.unsubscribe();
            throw rejected;
        }
    );
};
