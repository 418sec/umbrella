import { isFunction } from "@thi.ng/checks";
import { Transducer } from "@thi.ng/transducers";
import {
    CommonOpts,
    IStream,
    ISubscriber,
    LOGGER,
    StreamCancel,
    StreamSource
} from "./api";
import { Subscription } from "./subscription";
import { optsWithID } from "./utils/idgen";

/**
 * Creates a new `Stream` instance, optionally with given `StreamSource`
 * function and / or ID. If a `src` function is provided, the function
 * will be only called (with the `Stream` instance as single argument)
 * once the first subscriber has attached to the stream. If the function
 * returns another function, it will be used for cleanup purposes if the
 * stream is cancelled, e.g. if the last subscriber has unsubscribed.
 * Streams are intended as (primarily async) data sources in a dataflow
 * graph and are the primary construct for the various `from*()`
 * functions provided by the package. However, streams can also be
 * triggered manually (from outside the stream), in which case the user
 * should call `stream.next()` to cause value propagation.
 *
 * ```ts
 * a = rs.stream((s) => {
 *     s.next(1);
 *     s.next(2);
 *     s.done()
 * });
 * a.subscribe(trace("a"))
 * // a 1
 * // a 2
 * // a done
 *
 * // as reactive value mechanism
 * b = rs.stream();
 * // or alternatively
 * // b = rs.subscription();
 *
 * b.subscribe(trace("b1"));
 * b.subscribe(trace("b2"));
 *
 * // external / manual trigger
 * b.next(42);
 * // b1 42
 * // b2 42
 * ```
 *
 * `Stream`s (like `Subscription`s) implement the thi.ng/api `IDeref`
 * interface which provides read access to a stream's last received value.
 * This is useful for various purposes, e.g. in combination with
 * thi.ng/hdom, which supports direct embedding of streams (i.e. their
 * values) into UI components (and will be deref'd automatically). If the
 * stream has not yet emitted a value or if the stream is done, it will
 * deref to `undefined`.
 *
 * @param id
 * @param src
 */
export function stream<T>(opts?: Partial<CommonOpts>): Stream<T>;
// prettier-ignore
export function stream<T>(src: StreamSource<T>, opts?: Partial<CommonOpts>): Stream<T>;
export function stream<T>(src?: any, opts?: Partial<CommonOpts>): Stream<T> {
    return new Stream<T>(src, opts);
}

export class Stream<T> extends Subscription<T, T> implements IStream<T> {
    src?: StreamSource<T>;

    protected _cancel: StreamCancel | undefined;

    constructor();
    constructor(opts: Partial<CommonOpts>);
    constructor(src: StreamSource<T>, opts?: Partial<CommonOpts>);
    // prettier-ignore
    constructor(src?: StreamSource<T> | Partial<CommonOpts>, opts?: Partial<CommonOpts>) {
        const [_src, _opts] = isFunction(src) ? [src, opts] : [undefined, src];
        super(undefined, optsWithID("stream", _opts));
        this.src = _src;
    }

    subscribe<C>(
        sub: Partial<ISubscriber<C>>,
        xform: Transducer<T, C>,
        id?: string
    ): Subscription<T, C>;
    // subscribe<S extends Subscription<T, C>, C>(sub: S): S;
    subscribe<C>(sub: Subscription<T, C>): Subscription<T, C>;
    subscribe<C>(xform: Transducer<T, C>, id?: string): Subscription<T, C>;
    subscribe(sub: Partial<ISubscriber<T>>, id?: string): Subscription<T, T>;
    subscribe(...args: any[]) {
        const wrapped = super.subscribe.apply(this, <any>args);
        if (this.subs.length === 1) {
            this._cancel = (this.src && this.src(this)) || (() => void 0);
        }
        return wrapped;
    }

    unsubscribe(sub?: Subscription<T, any>) {
        const res = super.unsubscribe(sub);
        if (res && (!sub || (!this.subs || !this.subs.length))) {
            this.cancel();
        }
        return res;
    }

    done() {
        this.cancel();
        super.done();
        delete this.src;
        delete this._cancel;
    }

    error(e: any) {
        super.error(e);
        this.cancel();
    }

    cancel() {
        if (this._cancel) {
            LOGGER.debug(this.id, "cancel");
            const f = this._cancel;
            delete this._cancel;
            f();
        }
    }
}
