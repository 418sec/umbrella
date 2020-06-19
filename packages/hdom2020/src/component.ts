import type { MaybeDeref } from "@thi.ng/api";
import type { IComponent, NumOrElement } from "./api";
import { $compile } from "./compile";
import {
    $attribs,
    $clear,
    $el,
    $html,
    $move,
    $removeChild,
    $style,
    $text,
    $tree,
} from "./dom";

/**
 * Abstract base class / {@link IComponent} implementation. Provides
 * additional convenience methods for DOM element creation &
 * manipulation.
 */
export abstract class Component<T = any> implements IComponent<T> {
    el?: Element;

    abstract mount(
        parent: Element,
        index?: NumOrElement,
        ...xs: any[]
    ): Promise<Element>;

    async unmount() {
        this.$remove();
        this.el = undefined;
    }

    // @ts-ignore args
    update(state?: T) {}

    $el(
        tag: string,
        attribs?: any,
        body?: any,
        parent = this.el,
        idx?: number
    ) {
        return $el(tag, attribs, body, parent, idx);
    }

    $clear(el = this.el!) {
        return $clear(el);
    }

    $compile(tree: any) {
        return $compile(tree);
    }

    $tree(tree: any, root = this.el!) {
        return $tree(tree, root);
    }

    $text(body: any) {
        this.el && $text(<any>this.el, body);
    }

    $html(body: MaybeDeref<string>) {
        this.el && $html(<any>this.el, body);
    }

    $attribs(attribs: any, el = this.el!) {
        $attribs(el, attribs);
    }

    $style(rules: any, el = this.el!) {
        $style(el, rules);
    }

    $remove(el = this.el!) {
        $removeChild(el);
    }

    $moveTo(newParent: Element, el = this.el!, idx = -1) {
        $move(el, newParent, idx);
    }
}
