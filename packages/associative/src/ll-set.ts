import {
    Fn3,
    Pair,
    Predicate2,
    SEMAPHORE
} from "@thi.ng/api";
import { DCons } from "@thi.ng/dcons";
import { equiv } from "@thi.ng/equiv";
import { EquivSetOpts, IEquivSet } from "./api";
import { dissoc } from "./dissoc";
import { equivSet } from "./internal/equiv";
import { into } from "./into";

interface SetProps<T> {
    vals: DCons<T>;
    equiv: Predicate2<T>;
}

const __private = new WeakMap<LLSet<any>, SetProps<any>>();

const __vals = (inst: LLSet<any>) => __private.get(inst)!.vals;

/**
 * Similar to {@link ArraySet}, this class is an alternative implementation of
 * the native ES6 Set API using a {@link @thi.ng/dcons#DCons} linked
 * list as backing store and a customizable value equality / equivalence
 * predicate. By the default uses {@link @thi.ng/equiv#equiv} for
 * equivalence checking.
 *
 * Additionally, the type also implements the {@link @thi.ng/api#ICopy}, {@link @thi.ng/api#IEmpty} and
 * {@link @thi.ng/api#IEquiv} interfaces itself.
 */
export class LLSet<T> extends Set<T> implements IEquivSet<T> {
    constructor(
        vals?: Iterable<T> | null,
        opts: Partial<EquivSetOpts<T>> = {}
    ) {
        super();
        __private.set(this, {
            equiv: opts.equiv || equiv,
            vals: new DCons<T>()
        });
        vals && this.into(vals);
    }

    *[Symbol.iterator](): IterableIterator<T> {
        yield* __vals(this);
    }

    get [Symbol.species]() {
        return LLSet;
    }

    get [Symbol.toStringTag]() {
        return "LLSet";
    }

    get size(): number {
        return __vals(this).length;
    }

    copy() {
        const $this = __private.get(this)!;
        const s = new LLSet<T>(null, this.opts());
        __private.get(s)!.vals = $this.vals.copy();
        return s;
    }

    empty() {
        return new LLSet<T>(null, this.opts());
    }

    clear() {
        __vals(this).clear();
    }

    first(): T | undefined {
        if (this.size) {
            return __vals(this).head!.value;
        }
    }

    add(key: T) {
        !this.has(key) && __vals(this).push(key);
        return this;
    }

    into(keys: Iterable<T>) {
        return <this>into(this, keys);
    }

    has(key: T) {
        return this.get(key, <any>SEMAPHORE) !== <any>SEMAPHORE;
    }

    /**
     * Returns the canonical (stored) value for `key`, if present. If
     * the set contains no equivalent for `key`, returns `notFound`.
     *
     * @param key -
     * @param notFound -
     */
    get(key: T, notFound?: T): T | undefined {
        const $this = __private.get(this)!;
        const eq = $this.equiv;
        let i = $this.vals.head;
        while (i) {
            if (eq(i.value, key)) {
                return i.value;
            }
            i = i.next;
        }
        return notFound;
    }

    delete(key: T) {
        const $this = __private.get(this)!;
        const eq = $this.equiv;
        let i = $this.vals.head;
        while (i) {
            if (eq(i.value, key)) {
                $this.vals.splice(i, 1);
                return true;
            }
            i = i.next;
        }
        return false;
    }

    disj(keys: Iterable<T>) {
        return <this>dissoc(this, keys);
    }

    equiv(o: any) {
        return equivSet(this, o);
    }

    forEach(fn: Fn3<Readonly<T>, Readonly<T>, Set<T>, void>, thisArg?: any) {
        let i = __vals(this).head;
        while (i) {
            fn.call(thisArg, i.value, i.value, this);
            i = i.next;
        }
    }

    *entries(): IterableIterator<Pair<T, T>> {
        for (let v of __vals(this)) {
            yield [v, v];
        }
    }

    *keys(): IterableIterator<T> {
        yield* __vals(this);
    }

    *values(): IterableIterator<T> {
        yield* __vals(this);
    }

    opts(): EquivSetOpts<T> {
        return { equiv: __private.get(this)!.equiv };
    }
}
