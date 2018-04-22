import { compare } from "@thi.ng/api/compare";

import { DHeapOpts } from "./api";
import { Heap } from "./heap";

/**
 * Generic d-ary heap / priority queue with configurable arity (default
 * = 4) and ordering via user-supplied comparator. By default,
 * implements min-heap ordering and uses @thi.ng/api/compare. The arity
 * `d` must be >= 2. If `d=2`, the default binary `Heap` implementation
 * will be faster.
 *
 * https://en.wikipedia.org/wiki/D-ary_heap
 */
export class DHeap<T> extends Heap<T> {

    /**
     * Returns index of parent node or -1 if `idx < 1`.
     *
     * @param idx
     * @param d
     */
    static parentIndex(idx: number, d = 4) {
        return idx > 0 ? ((idx - 1) / d) | 0 : -1;
    }

    /**
     * If `d=2` return index of other sibling. For all other `d`
     * there're no unique solutions so always returns -1.
     *
     * @param idx
     * @param d
     */
    static siblingIndex(idx: number, d = 4) {
        return d === 2 ? Heap.siblingIndex(idx) : -1;
    }

    /**
     * Returns index of 1st child or -1 if `idx < 0`.
     *
     * @param idx
     * @param d
     */
    static childIndex(idx: number, d = 4) {
        return idx >= 0 ? (idx * d) + 1 : -1;
    }

    protected d: number;

    constructor(values?: Iterable<T>, opts?: Partial<DHeapOpts<T>>) {
        super(null, Object.assign({ compare }, opts));
        this.d = (opts && opts.d) || 4;
        this.values = [];
        if (values) {
            this.into(values);
        }
    }

    parent(n: number) {
        n = DHeap.parentIndex(n, this.d);
        return n >= 0 ? this.values[n] : undefined;
    }

    children(n: number) {
        n = DHeap.childIndex(n, this.d);
        const vals = this.values;
        if (n >= vals.length) return;
        return vals.slice(n, n + this.d);
    }

    leaves() {
        const vals = this.values;
        if (!vals.length) {
            return []
        }
        return vals.slice(DHeap.parentIndex(vals.length - 1, this.d) + 1);
    }

    heapify() {
        for (var i = ((this.values.length - 1) / this.d) | 0; i >= 0; i--) {
            this.percolateDown(i);
        }
    }

    protected percolateUp(i: number) {
        const vals = this.values;
        const node = vals[i];
        const d = this.d;
        const cmp = this.compare;
        while (i > 0) {
            const pi = ((i - 1) / d) | 0;
            const parent = vals[pi];
            if (cmp(node, parent) >= 0) {
                break;
            }
            vals[pi] = node;
            vals[i] = parent;
            i = pi;
        }
    }

    protected percolateDown(i: number) {
        const vals = this.values;
        const n = vals.length;
        const d = this.d;
        const node = vals[i];
        const cmp = this.compare;
        let child = (i * d) + 1, minChild;
        while (child < n) {
            minChild = child;
            for (let j = child + 1, k = child + d; j < k; j++) {
                if (j < n && cmp(vals[j], vals[minChild]) < 0) {
                    minChild = j;
                }
            }
            if (cmp(vals[minChild], node) < 0) {
                vals[i] = vals[minChild];
            } else {
                break;
            }
            i = minChild;
            child = (i * d) + 1;
        }
        vals[i] = node;
    }
}