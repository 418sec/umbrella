import { IID } from "@thi.ng/api/api";
import { Transducer } from "@thi.ng/transducers/api";

import { ISubscribable, State } from "./api";
import { Subscription } from "./subscription";

export interface StreamMergeOpts<A, B> extends IID<string> {
    src: ISubscribable<A>[];
    xform: Transducer<A, B>;
    close: boolean;
}

/**
 * Subscription type consuming inputs from multiple inputs and passing
 * received values on to any subscribers. Input streams can be added and
 * removed dynamically. By default, the StreamMerge calls `done()` when
 * the last active input is done, but this behavior can be overridden via
 * the `close` constructor option (set to `false`).
 */
export class StreamMerge<A, B> extends Subscription<A, B> {

    sources: Map<ISubscribable<A>, Subscription<A, any>>;
    autoClose: boolean;

    constructor(opts?: Partial<StreamMergeOpts<A, B>>) {
        opts = opts || {};
        super(null, opts.xform, null, opts.id || `streammerge-${Subscription.NEXT_ID++}`);
        this.sources = new Map();
        this.autoClose = opts.close !== false;
        if (opts.src) {
            this.addAll(opts.src);
        }
    }

    add(src: ISubscribable<A>) {
        this.ensureState();
        this.sources.set(
            src,
            src.subscribe({
                next: (x) => {
                    if (x instanceof Subscription) {
                        this.add(x);
                    } else {
                        this.next(x);
                    }
                },
                done: () => this.markDone(src)
            }));
    }

    addAll(src: ISubscribable<A>[]) {
        for (let s of src) {
            this.add(s);
        }
    }

    remove(src: ISubscribable<A>) {
        const sub = this.sources.get(src);
        if (sub) {
            this.sources.delete(src);
            sub.unsubscribe();
        }
    }

    removeAll(src: ISubscribable<A>[]) {
        for (let s of src) {
            this.remove(s);
        }
    }

    unsubscribe(sub?: Subscription<B, any>) {
        if (!sub) {
            for (let s of this.sources.values()) {
                s.unsubscribe();
            }
            this.state = State.DONE;
            this.sources.clear();
        }
        return super.unsubscribe(sub);
    }

    protected markDone(src: ISubscribable<A>) {
        this.remove(src);
        if (this.autoClose && !this.sources.size) {
            this.done();
        }
    }
}
