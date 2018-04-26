import * as assert from "assert";
import { TripleStore, Triple } from "../src/index";

describe("rstream-query", () => {

    const triples: Triple[] = [
        ["a", "type", "foo"], // 0
        ["b", "type", "bar"], // 1
        ["c", "type", "baz"], // 2
        ["a", "value", 0],    // 3
        ["b", "value", 1],    // 4
        ["c", "friend", "a"], // 5
    ];

    let store: TripleStore;

    beforeEach(() => {
        store = new TripleStore(triples);
    });

    it("pattern query (S)", () => {
        const res = [];
        store.addPatternQuery(["a", null, null], "q", false).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([0, 3])]);
    });

    it("pattern query (P)", () => {
        const res = [];
        store.addPatternQuery([null, "type", null], "q", false).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([0, 1, 2])]);
    });

    it("pattern query (O)", () => {
        const res = [];
        store.addPatternQuery([null, null, "a"], "q", false).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([5])]);
    });

    it("pattern query (SP)", () => {
        const res = [];
        store.addPatternQuery(["a", "value", null], "q", false).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([3])]);
    });

    it("pattern query (PO)", () => {
        const res = [];
        store.addPatternQuery([null, "value", 0], "q", false).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([3])]);
    });

    it("pattern query (SO)", () => {
        const res = [];
        store.addPatternQuery(["b", null, "bar"], "q", false).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([1])]);
    });

    it("pattern query (SPO)", () => {
        const res = [];
        store.addPatternQuery(["c", "type", "baz"], "q", false).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([2])]);
    });

    it("pattern query (all)", () => {
        const res = [];
        store.addPatternQuery([null, null, null], "q", false).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([0, 1, 2, 3, 4, 5])]);
    });

    it("param query (S)", () => {
        const res = [];
        store.addParamQuery(["a", "?p", "?o"]).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([{ p: "type", o: "foo" }, { p: "value", o: 0 }])]);
    });

    it("param query (P)", () => {
        const res = [];
        store.addParamQuery(["?s", "type", "?o"]).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([{ s: "a", o: "foo" }, { s: "b", o: "bar" }, { s: "c", o: "baz" }])]);
    });

    it("param query (O)", () => {
        const res = [];
        store.addParamQuery(["?s", "?p", "a"]).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([{ s: "c", p: "friend" }])]);
    });

    it("param query (SP)", () => {
        const res = [];
        store.addParamQuery(["a", "value", "?o"]).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([{ o: 0 }])]);
    });

    it("param query (PO)", () => {
        const res = [];
        store.addParamQuery(["?s", "value", 0]).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([{ s: "a" }])]);
    });

    it("param query (SO)", () => {
        const res = [];
        store.addParamQuery(["b", "?p", "bar"]).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([{ p: "type" }])]);
    });

    it("param query (SPO)", () => {
        assert.throws(() => store.addParamQuery(["c", "type", "baz"]));
    });

    it("param query (all)", () => {
        const res = [];
        store.addParamQuery(["?s", "?p", "?o"]).subscribe({ next: (r) => res.push(r) });
        assert.deepEqual(res, [new Set([
            { s: "a", p: "type", o: "foo" },
            { s: "b", p: "type", o: "bar" },
            { s: "c", p: "type", o: "baz" },
            { s: "a", p: "value", o: 0 },
            { s: "b", p: "value", o: 1 },
            { s: "c", p: "friend", o: "a" },
        ])]);
    });
});
