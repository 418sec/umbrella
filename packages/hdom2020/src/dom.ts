import {
    implementsFunction,
    isArray,
    isFunction,
    isNotStringAndIterable,
    isNumber,
    isString,
} from "@thi.ng/checks";
import { illegalArgs } from "@thi.ng/errors";
import { RE_TAG, SVG_NS, SVG_TAGS } from "@thi.ng/hiccup";
import { isDeref } from "./utils";

/**
 * hdom-style DOM tree creation from hiccup format. Returns DOM element
 * of `tree` root.
 *
 * @remarks
 * Supports elements given in these forms:
 *
 * - {@link IComponent} instance
 * - `["div#id.class", {...attribs}, ...children]`
 * - `[function, ...args]`
 * - ES6 iterator of the above (as children only!)
 *
 * Any other values will be cast to strings and added as spans to
 * current `parent`.
 *
 * @param tree
 * @param parent
 * @param idx
 */
export const $tree = async (
    tree: any,
    parent?: Element,
    idx = -1
): Promise<any> => {
    if (isArray(tree)) {
        const tag = tree[0];
        if (isString(tag)) {
            parent = $el(tag, tree[1], null, parent, idx);
            const n = tree.length;
            for (let i = 2; i < n; i++) {
                $tree(tree[i], parent);
            }
            return parent;
        }
        if (implementsFunction(tag, "mount")) {
            return tag.mount(parent, ...tree.slice(1));
        }
        if (isFunction(tag)) {
            return $tree(tag.apply(null, tree.slice(1)), parent);
        }
        illegalArgs(`tag not supported: ${tag}`);
    }
    if (implementsFunction(tree, "mount")) {
        return tree.mount(parent);
    }
    if (isNotStringAndIterable(tree)) {
        for (let t of tree) {
            $tree(t, parent);
        }
    }
    return tree != null ? $el("span", null, tree, <HTMLElement>parent) : null;
};

export const $el = (
    tag: string,
    attribs: any,
    body?: any,
    parent?: Element,
    idx: Element | number = -1
) => {
    const match = RE_TAG.exec(tag);
    if (match) {
        let [, mtag, id, clazz] = match;
        attribs = { ...attribs };
        id && (attribs.id = id);
        if (clazz) {
            clazz = clazz.replace(/\./g, " ");
            const aclass = attribs.class;
            if (aclass) {
                !isString(aclass) &&
                    (attribs.class = updateClasses("", aclass));
                attribs.class += " " + clazz;
            } else {
                attribs.class = clazz;
            }
        }
        tag = mtag;
    }
    const el = SVG_TAGS[tag]
        ? document.createElementNS(SVG_NS, tag)
        : document.createElement(tag);
    attribs && $attribs(el, attribs);
    body != null && $body(<any>el, body);
    parent && $addChild(parent, el, idx);
    return el;
};

export const $addChild = (
    parent: Element,
    child: Element,
    idx: Element | number = -1
) => {
    isNumber(idx)
        ? idx < 0 || idx >= parent.children.length
            ? parent.appendChild(child)
            : parent.insertBefore(child, parent.children[idx])
        : parent.insertBefore(child, idx);
};

export const $removeChild = (el: Element) => el.parentNode!.removeChild(el);

export const $move = (
    el: Element,
    newParent: Element,
    idx: Element | number = -1
) => {
    $removeChild(el);
    $addChild(newParent, el, idx);
};

export const $clear = (el: Element) => ((el.innerHTML = ""), el);

export const $body = (el: HTMLElement, body: any) => {
    el.innerText = String(
        implementsFunction(body, "deref") ? (<any>body).deref() : body
    );
};

export const $attribs = (el: Element, attribs: any) => {
    for (let id in attribs) {
        setAttrib(el, id, attribs[id], attribs);
    }
};

const setAttrib = (el: Element, id: string, val: any, attribs: any) => {
    implementsFunction(val, "deref") && (val = val.deref());
    const isListener = id.startsWith("on");
    if (isListener) {
        id = id.substr(2);
        isArray(val)
            ? el.addEventListener(id, val[0], val[1])
            : el.addEventListener(id, val);
        return;
    }
    isFunction(val) && (val = val(attribs));
    switch (id) {
        case "style":
            $style(el, val);
            break;
        case "value":
            updateValueAttrib(<HTMLInputElement>el, val);
            break;
        case "accesskey":
            (<HTMLElement>el).accessKey = val;
            break;
        case "contenteditable":
            (<HTMLElement>el).contentEditable = val;
            break;
        case "tabindex":
            (<HTMLElement>el).tabIndex = val;
            break;
        case "align":
        case "autocapitalize":
        case "checked":
        case "dir":
        case "draggable":
        case "hidden":
        case "id":
        case "lang":
        case "namespaceURI":
        case "scrollTop":
        case "scrollLeft":
        case "title":
            (<any>el)[id] = val;
            break;
        case "class":
            el.className = isString(val)
                ? val
                : updateClasses(el.className, val);
            break;
        default:
            val === false || val == null
                ? el.removeAttribute(id)
                : el.setAttribute(id, val);
    }
};

const updateClasses = (existing: string, val: any) => {
    const classes = new Set(existing.split(" "));
    val = isDeref(val) ? val.deref() : val;
    if (isString(val)) {
        classes.add(val);
    } else {
        for (let id in val) {
            let c = val[id];
            isDeref(c) && (c = c.deref());
            c ? classes.add(id) : classes.delete(id);
        }
    }
    return [...classes].join(" ");
};

const updateValueAttrib = (el: HTMLInputElement, value: any) => {
    let ev;
    switch (el.type) {
        case "text":
        case "textarea":
        case "password":
        case "search":
        case "number":
        case "email":
        case "url":
        case "tel":
        case "date":
        case "datetime-local":
        case "time":
        case "week":
        case "month":
            if ((ev = el.value) !== undefined && isString(value)) {
                const off =
                    value.length - (ev.length - (el.selectionStart || 0));
                el.value = value;
                el.selectionStart = el.selectionEnd = off;
                break;
            }
        default:
            el.value = value;
    }
};

export const $style = (el: Element, rules: string | any) => {
    if (isString(rules)) {
        el.setAttribute("style", rules);
    } else {
        const style: any = (<HTMLElement>el).style;
        for (let id in rules) {
            let v = rules[id];
            isDeref(v) && (v = v.deref());
            isFunction(v) && (v = v(rules));
            style[id] = v || "";
        }
    }
};
