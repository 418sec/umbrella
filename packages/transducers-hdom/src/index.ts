import { HDOMImplementation, HDOMOpts } from "@thi.ng/hdom/api";
import { DEFAULT_IMPL } from "@thi.ng/hdom/default";
import { resolveRoot } from "@thi.ng/hdom/utils";
import { derefContext } from "@thi.ng/hiccup/deref";
import { Transducer } from "@thi.ng/transducers/api";
import { reducer } from "@thi.ng/transducers/reduce";
import { scan } from "@thi.ng/transducers/xform/scan";

/**
 * Side-effecting & stateful transducer which receives @thi.ng/hdom
 * component trees, diffs each against previous value and applies
 * required changes to browser DOM starting at given root element.
 *
 * By default, incoming values are first normalized using hdom's
 * `normalizeTree()` function and a copy of the given (optional) `ctx`
 * object is provided to all embedded component functions in the tree.
 * Any context keys with values implementing the thi.ng/api `IDeref`
 * interface, will be automatically deref'd prior to tree normalization.
 *
 * If the `hydrate` option is given, the first received tree is only
 * used to inject event listeners and initialize components with
 * lifecycle `init()` methods and expects an otherwise identical,
 * pre-existing DOM. All succeeding trees are diffed then as usual.
 *
 * This transducer is primarily intended for @thi.ng/rstream dataflow
 * graph based applications, where it can be used as final leaf
 * subscription to reactively reflect UI changes back to the user,
 * without using the usual RAF update loop used by hdom by default. In
 * this setup, DOM updates will only be performed when the stream this
 * transducer is attached to emits new values (i.e. hdom component
 * trees).
 *
 * Please see here for further details:
 * https://github.com/thi-ng/umbrella/blob/master/packages/hdom/src/start.ts
 *
 * @param opts hdom options
 */
export const updateDOM =
    (opts: Partial<HDOMOpts> = {}, impl: HDOMImplementation<any> = DEFAULT_IMPL): Transducer<any, any[]> => {
        const _opts = { root: "app", ...opts };
        const root = resolveRoot(_opts.root);
        return scan<any, any[]>(
            reducer(
                () => [],
                (prev, curr) => {
                    _opts.ctx = derefContext(opts.ctx);
                    curr = impl.normalizeTree(_opts, curr);
                    if (curr != null) {
                        if (_opts.hydrate) {
                            impl.hydrateTree(_opts, root, curr);
                            _opts.hydrate = false;
                        } else {
                            impl.diffTree(_opts, impl, root, prev, curr, 0);
                        }
                        return curr;
                    }
                    return prev;
                }
            )
        );
    };
