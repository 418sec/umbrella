import { Atom } from "@thi.ng/atom";
import { derefContext } from "@thi.ng/hiccup";
import { map, range } from "@thi.ng/iterators";
import * as assert from "assert";
import { normalizeTree } from "../src/normalize";

const _check = (a: any, b: any, ctx: any = null) =>
    assert.deepEqual(normalizeTree({ ctx, keys: false, span: false }, a), b);

const check = (id: string, a: any, b: any) => it(id, () => _check(a, b));

describe("hdom", () => {
    check("undefined", undefined, undefined);

    check("null", null, undefined);

    check("empty tree", [], undefined);

    check("simple div", ["div", "foo"], ["div", {}, "foo"]);

    check("emmet id", ["div#foo", "hi"], ["div", { id: "foo" }, "hi"]);

    check(
        "emmet id + id attr",
        ["div#foo", { id: "bar" }],
        ["div", { id: "foo" }]
    );

    check(
        "emmet id + class",
        ["div#id.foo.bar", "hi"],
        ["div", { id: "id", class: "foo bar" }, "hi"]
    );
    check(
        "emmet class + class attr",
        ["div.foo.bar", { class: "baz" }],
        ["div", { class: "baz foo bar" }]
    );

    check(
        "emmet id + class + attrib",
        ["div#id.foo.bar", { extra: 23 }, "hi"],
        ["div", { id: "id", class: "foo bar", extra: 23 }, "hi"]
    );

    check("root fn", () => ["div"], ["div", {}]);

    check(
        "tag fn w/ args",
        [(_: any, id: string, body: any) => ["div#" + id, body], "foo", "bar"],
        ["div", { id: "foo" }, "bar"]
    );

    check(
        "child fn",
        ["div", (x: any) => ["span", x]],
        ["div", {}, ["span", {}]]
    );

    check(
        "child arrays",
        ["section", [["div", "foo"], "bar"]],
        ["section", {}, ["div", {}, "foo"], "bar"]
    );

    check(
        "iterator",
        ["div", map((x) => [`div#id${x}`, x], range(3))],
        [
            "div",
            {},
            ["div", { id: "id0" }, 0],
            ["div", { id: "id1" }, 1],
            ["div", { id: "id2" }, 2]
        ]
    );

    check("deref toplevel", new Atom(["a"]), ["a", {}]);

    check("deref child", ["a", new Atom(["b"])], ["a", {}, ["b", {}]]);

    it("life cycle", () => {
        let src: any = { render: () => ["div", "foo"] };
        let res: any = ["div", {}, ["span", {}, "foo"]];
        res.__this = src;
        res.__init = res.__release = undefined;
        res.__args = [null];
        assert.deepEqual(normalizeTree({ keys: false }, [src]), res);
        res = ["div", { key: "0" }, ["span", { key: "0-0" }, "foo"]];
        res.__this = src;
        res.__init = res.__release = undefined;
        res.__args = [null];
        assert.deepEqual(normalizeTree({}, [src]), res);
    });

    it("dyn context", () => {
        assert.deepEqual(
            derefContext(
                {
                    a: 23,
                    b: new Atom(42),
                    c: new Atom({ foo: { bar: 66 } }).addView("foo.bar")
                },
                ["a", "b", "c"]
            ),
            {
                a: 23,
                b: 42,
                c: 66
            }
        );
    });
});
