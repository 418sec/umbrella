import {
    IEquiv,
    IWatchMixin,
    Predicate,
    Watch
} from "@thi.ng/api";
import { illegalState } from "@thi.ng/errors";
import { Path, setIn, updateIn } from "@thi.ng/paths";
import {
    IAtom,
    IView,
    SwapFn,
    ViewTransform
} from "./api";
import { View } from "./view";


/**
 * Mutable wrapper for an (usually) immutable value. Support for
 * watches.
 */
@IWatchMixin
export class Atom<T> implements
    IAtom<T>,
    IEquiv {

    protected _value: T;
    protected valid: Predicate<T>;
    protected _watches: any;

    constructor(val?: T, valid?: Predicate<T>) {
        if (valid && !valid(val)) {
            illegalState("initial state value did not validate");
        }
        this._value = val;
        this.valid = valid;
    }

    get value() {
        return this._value;
    }

    set value(val: T) {
        this.reset(val);
    }

    deref() {
        return this._value;
    }

    equiv(o: any) {
        return this === o;
    }

    reset(val: T) {
        const old = this._value;
        if (this.valid && !this.valid(val)) {
            return old;
        }
        this._value = val;
        this.notifyWatches(old, val);
        return val;
    }

    resetIn<V>(path: Path, val: V) {
        return this.reset(setIn(this._value, path, val));
    }

    swap(fn: SwapFn<T>, ...args: any[]) {
        return this.reset(fn.apply(null, [this._value, ...args]));
    }

    swapIn<V>(path: Path, fn: SwapFn<V>, ...args: any[]) {
        return this.reset(updateIn(this._value, path, fn, ...args));
    }

    // mixin stub
    /* istanbul ignore next */
    addWatch(_: string, __: Watch<T>) {
        return false;
    }

    // mixin stub
    /* istanbul ignore next */
    removeWatch(_: string) {
        return false;
    }

    // mixin stub
    /* istanbul ignore next */
    notifyWatches(_: T, __: T) { }

    addView<V>(path: Path, tx?: ViewTransform<V>, lazy = true): IView<V> {
        return new View<V>(this, path, tx, lazy);
    }

    release() {
        delete this._watches;
        delete this._value;
        return true;
    }
}
