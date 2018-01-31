import { Predicate2, Watch } from "@thi.ng/api/api";

import { IAtom, SwapFn } from "./api";

/**
 * Undo/redo history stack wrapper for atoms and cursors.
 * Implements `IAtom` interface and so can be used directly in place
 * and delegates to wrapped atom/cursor. Value changes are only
 * recorded in history if `changed` predicate returns truthy value,
 * or else by calling `record()` directly.
 */
export class History<T> implements
    IAtom<T> {

    state: IAtom<T>;
    maxLen: number;
    changed: Predicate2<T>;

    history: T[];
    future: T[];

    /**
     * @param state parent state
     * @param maxLen max size of undo stack
     * @param changed predicate to determine changed values (default `!==`)
     */
    constructor(state: IAtom<T>, maxLen = 100, changed?: Predicate2<T>) {
        this.state = state;
        this.maxLen = maxLen;
        this.changed = changed || ((a, b) => a !== b);
        this.clear();
    }

    /**
     * Clears history & future stacks
     */
    clear() {
        this.history = [];
        this.future = [];
    }

    /**
     * Attempts to re-apply most recent historical value to atom and
     * returns it if successful (i.e. there's a history). Before the
     * switch, first records the atom's current value into the future
     * stack (to enable `redo()` feature). Returns `undefined` if
     * there's no history.
     */
    undo() {
        if (this.history.length) {
            this.future.push(this.state.deref());
            return this.state.reset(this.history.pop());
        }
    }

    /**
     * Attempts to re-apply most recent value from future stack to atom
     * and returns it if successful (i.e. there's a future). Before the
     * switch, first records the atom's current value into the history
     * stack (to enable `undo()` feature). Returns `undefined` if
     * there's no future (so sad!).
     */
    redo() {
        if (this.future.length) {
            this.history.push(this.state.deref());
            return this.state.reset(this.future.pop());
        }
    }

    /**
     * `IAtom.reset()` implementation. Delegates to wrapped atom/cursor,
     * but too applies `changed` predicate to determine if there was a
     * change and previous value should be recorded.
     *
     * @param val
     */
    reset(val: T) {
        const prev = this.state.deref();
        this.state.reset(val);
        this.changed(prev, val) && this.record(prev);
        return val;
    }

    /**
     * `IAtom.swap()` implementation. Delegates to wrapped atom/cursor,
     * but too applies `changed` predicate to determine if there was a
     * change and previous value should be recorded.
     *
     * @param val
     */
    swap(fn: SwapFn<T>, ...args: any[]) {
        const prev = this.state.deref(),
            curr = this.state.swap.apply(this.state, [fn, ...args]);
        this.changed(prev, curr) && this.record(prev);
        return curr;
    }

    /**
     * Records given state in history. This method is only needed when
     * manually managing snapshots, i.e. when applying multiple swaps
     * on the wrapped atom directly, but not wanting to create an
     * history entry for each change. **DO NOT call this explicitly if
     * using `History.reset()` / `History.swap()`**.
     *
     * If no `state` is given, uses the wrapped atom's current state value.
     *
     * @param state
     */
    record(state?: T) {
        if (this.history.length >= this.maxLen) {
            this.history.shift();
        }
        this.history.push(arguments.length > 0 ? state : this.state.deref());
    }

    /**
     * Returns wrapped atom's **current** value.
     */
    deref(): T {
        return this.state.deref();
    }

    /**
     * `IWatch.addWatch()` implementation. Delegates to wrapped atom/cursor.
     *
     * @param id
     * @param fn
     */
    addWatch(id: string, fn: Watch<T>) {
        return this.state.addWatch(id, fn);
    }

    /**
     * `IWatch.removeWatch()` implementation. Delegates to wrapped atom/cursor.
     *
     * @param id
     */
    removeWatch(id: string) {
        return this.state.removeWatch(id);
    }

    /**
     * `IWatch.notifyWatches()` implementation. Delegates to wrapped atom/cursor.
     *
     * @param oldState
     * @param newState
     */
    notifyWatches(oldState: T, newState: T) {
        return this.state.notifyWatches(oldState, newState);
    }
}
