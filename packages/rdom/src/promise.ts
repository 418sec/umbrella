import type { Fn } from "@thi.ng/api";
import type { ComponentLike, IComponent, NumOrElement } from "./api";
import { Component } from "./component";

export const $promise = (
    prom: Promise<ComponentLike>,
    error?: Fn<Error, any>
) => new $Promise(prom, error);

export class $Promise extends Component {
    inner?: IComponent;

    constructor(
        protected promise: Promise<ComponentLike>,
        protected error: Fn<Error, any> = (e) => e
    ) {
        super();
    }

    async mount(parent: Element, index: NumOrElement) {
        try {
            this.inner = this.$compile(await this.promise);
        } catch (e) {
            this.inner = this.$compile(this.error(e));
        }
        return (this.el = await this.inner.mount(parent, index));
    }

    async unmount() {
        await this.inner!.unmount();
        this.inner = undefined;
        this.el = undefined;
    }
}
