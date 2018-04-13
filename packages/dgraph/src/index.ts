import { ICopy } from "@thi.ng/api/api";
import { equiv } from "@thi.ng/api/equiv";
import { illegalArgs } from "@thi.ng/api/error";
import { ArrayMap } from "@thi.ng/associative/array-map";
import { ArraySet } from "@thi.ng/associative/array-set";
import { union } from "@thi.ng/associative/union";
import { filter } from "@thi.ng/iterators/filter";
import { reduce } from "@thi.ng/iterators/reduce";

export class DGraph<T> implements
    Iterable<T>,
    ICopy<DGraph<T>> {

    dependencies: ArrayMap<T, ArraySet<T>>;
    dependents: ArrayMap<T, ArraySet<T>>;

    constructor() {
        this.dependencies = new ArrayMap<T, ArraySet<T>>();
        this.dependents = new ArrayMap<T, ArraySet<T>>();
    }

    *[Symbol.iterator]() {
        yield* this.sort();
    }

    get [Symbol.species]() {
        return DGraph;
    }

    copy() {
        const g = new DGraph<T>();
        for (let e of this.dependencies) {
            g.dependencies.set(e[0], e[1].copy());
        }
        for (let e of this.dependents) {
            g.dependents.set(e[0], e[1].copy());
        }
        return g;
    }

    addDependency(node: T, dep: T) {
        if (equiv(node, dep) || this.depends(dep, node)) {
            illegalArgs(`Circular dependency between: ${node} & ${dep}`);
        }
        let d: ArraySet<T> = this.dependencies.get(node);
        this.dependencies.set(node, d ? d.add(dep) : new ArraySet<T>([dep]));
        d = this.dependents.get(dep);
        this.dependents.set(dep, d ? d.add(node) : new ArraySet<T>([node]));
        return this;
    }

    removeEdge(node: T, dep: T) {
        let d = this.dependencies.get(node);
        if (d) {
            d.delete(dep);
        }
        d = this.dependents.get(dep);
        if (d) {
            d.delete(node);
        }
        return this;
    }

    removeNode(x: T) {
        this.dependencies.delete(x);
        return this;
    }

    depends(x: T, y: T) {
        return this.transitiveDependencies(x).has(y);
    }

    dependent(x: T, y: T) {
        return this.transitiveDependents(x).has(y);
    }

    immediateDependencies(x: T): Set<T> {
        return this.dependencies.get(x) || new ArraySet<T>();
    }

    immediateDependents(x: T): Set<T> {
        return this.dependents.get(x) || new ArraySet<T>();
    }

    isLeaf(x: T) {
        return this.immediateDependents(x).size === 0;
    }

    isRoot(x: T) {
        return this.immediateDependencies(x).size === 0;
    }

    nodes(): Set<T> {
        return union(
            new ArraySet<T>(this.dependencies.keys()),
            new ArraySet<T>(this.dependents.keys()),
        );
    }

    transitiveDependencies(x: T) {
        return transitive(this.dependencies, x);
    }

    transitiveDependents(x: T) {
        return transitive(this.dependents, x);
    }

    sort() {
        const sorted: T[] = [];
        const g = this.copy();
        let queue = new ArraySet(filter((node: T) => g.isLeaf(node), g.nodes()));
        while (true) {
            if (!queue.size) {
                return sorted.reverse();
            }
            const node = queue.first();
            queue.delete(node);
            for (let d of (<ArraySet<T>>g.immediateDependencies(node)).copy()) {
                g.removeEdge(node, d);
                if (g.isLeaf(d)) {
                    queue.add(d);
                }
            }
            sorted.push(node);
            g.removeNode(node);
        }
    }
}

function transitive<T>(nodes: ArrayMap<T, ArraySet<T>>, x: T): ArraySet<T> {
    const deps: ArraySet<T> = nodes.get(x);
    if (deps) {
        return reduce(
            (acc, k: T) => <ArraySet<T>>union(acc, transitive(nodes, k)),
            deps,
            deps
        );
    }
    return new ArraySet<T>();
}
