import { derefContext } from "@thi.ng/hiccup/deref";
import { HDOMImplementation, HDOMOpts } from "./api";
import { DEFAULT_IMPL } from "./default";
import { resolveRoot } from "./utils";

/**
 * One-off hdom tree conversion & target DOM application. Takes same
 * options as `start()`, but performs no diffing and only creates or
 * hydrates target once. The given tree is first normalized and if
 * result is `null` or `undefined` no further action will be taken.
 *
 * @param tree
 * @param opts
 * @param impl
 */
export const renderOnce = (
    tree: any,
    opts: Partial<HDOMOpts> = {},
    impl: HDOMImplementation<any> = DEFAULT_IMPL) => {

    opts = { root: "app", ...opts };
    opts.ctx = derefContext(opts.ctx);
    const root = resolveRoot(opts.root);
    tree = impl.normalizeTree(opts, tree);
    if (!tree) return;
    opts.hydrate ?
        impl.hydrateTree(opts, root, tree) :
        impl.createTree(opts, root, tree);
};
