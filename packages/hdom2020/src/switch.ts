import { assert, Fn, NumOrString } from "@thi.ng/api";
import { ISubscribable } from "@thi.ng/rstream";
import type { IComponent, IMountWithState } from "./api";
import { $compile } from "./compile";
import { Component } from "./component";
import { $sub } from "./sub";

export const $switch = <T>(
    src: ISubscribable<T>,
    keyFn: Fn<T, NumOrString>,
    ctors: Record<NumOrString, Fn<T, Promise<any>>>,
    loader?: IComponent
) => $sub<T>(src, new Switch<T>(keyFn, ctors, loader));

export const $refresh = <T>(
    src: ISubscribable<T>,
    ctor: Fn<T, Promise<any>>,
    loader?: IComponent
) => $switch(src, () => 0, { 0: ctor }, loader);

export class Switch<T> extends Component implements IMountWithState<T> {
    protected val?: T;
    protected parent?: Element;
    protected inner?: IComponent<T>;

    constructor(
        protected keyFn: Fn<T, NumOrString>,
        protected ctors: Record<NumOrString, Fn<T, Promise<any>>>,
        protected loader?: IComponent
    ) {
        super();
    }

    async mount(parent: Element, val: T) {
        this.parent = parent;
        await this.update(val);
        return this.inner!.el!;
    }

    async unmount() {
        this.inner && (await this.inner!.unmount());
        this.val = undefined;
        this.parent = undefined;
        this.inner = undefined;
    }

    async update(val: T) {
        this.inner && (await this.inner.unmount());
        if (val != null && val !== this.val) {
            this.val = val;
            this.loader && (await this.loader.mount(this.parent!));
            const key = this.keyFn(val);
            const next = this.ctors[key];
            assert(!!next, `no component registered for key: ${key}`);
            this.inner = $compile(await next(val));
            this.loader && (await this.loader.unmount());
        } else {
            this.loader && (this.inner = this.loader);
        }
        this.inner && (await this.inner.mount(this.parent!));
    }
}
