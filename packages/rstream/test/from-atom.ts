import { Atom, Cursor, History } from "@thi.ng/atom";
import * as assert from "assert";
import { fromAtom } from "../src/from/atom";

// prettier-ignore
describe("fromAtom", () => {

    it("works with atom", (done) => {
        let a = new Atom(0);
        let src = fromAtom(a, false);
        let calledNext = false;
        src.subscribe({
            next(x) {
                assert.equal(x, 23);
                calledNext = true;
            },
            done() {
                assert(calledNext, "not called next()");
                done();
            },
            error() {
                assert.fail("called error()");
            }
        });
        a.reset(23);
        src.done();
    });

    it("works with cursor", (done) => {
        let state = { a: { b: {}, d: { e: 42 } } };
        let a = new Atom(state);
        let c = new Cursor(a, "a.b.c");
        let src = fromAtom(c, false);
        let calledNext = false;
        src.subscribe({
            next(x) {
                assert.equal(x, 23);
                calledNext = true;
            },
            done() {
                assert(calledNext, "not called next()");
                assert.deepEqual(a.deref(), { a: { b: { c: 23 }, d: { e: 42 } } });
                assert.strictEqual(a.deref().a.d, state.a.d);
                done();
            },
            error() {
                assert.fail("called error()");
            }
        });
        c.reset(23);
        src.done();
    });

    it("works with history (single)", () => {
        let a = new Atom({});
        let c = new Cursor(a, "a.b");
        let h = new History(c);
        let src = fromAtom(h, true);
        let buf: any[] = [];
        src.subscribe({ next(x) { buf.push(x); } });
        h.reset(1);
        h.reset(2);
        h.reset({ c: 3 });
        assert.deepEqual(a.deref(), { a: { b: { c: 3 } } });
        h.undo();
        assert.deepEqual(a.deref(), { a: { b: 2 } });
        h.redo();
        assert.deepEqual(a.deref(), { a: { b: { c: 3 } } });
        h.undo();
        assert.deepEqual(a.deref(), { a: { b: 2 } });
        h.undo();
        assert.deepEqual(a.deref(), { a: { b: 1 } });
        h.undo();
        assert.deepEqual(a.deref(), { a: { b: undefined } });
        src.done();
        assert.deepEqual(buf, [undefined, 1, 2, { c: 3 }, 2, { c: 3 }, 2, 1, undefined]);
    });

    it("works with history (multiple)", () => {
        let a = new Atom({});
        let h = new History(a);
        let c1 = new Cursor(a, "a.b");
        let c2 = new Cursor(a, "c");
        let src1 = fromAtom(c1, true);
        let src2 = fromAtom(c2, true);
        let buf1:any[] = [];
        let buf2:any[] = [];
        src1.subscribe({ next(x) { buf1.push(x); } });
        src2.subscribe({ next(x) { buf2.push(x); } });
        h.record();
        c1.reset(1);

        h.record();
        c1.reset(2);
        c2.reset(10);

        h.record();
        c1.reset(3);

        h.record();
        c2.reset(20);

        assert.deepEqual(buf1, [undefined, 1, 2, 3]);
        assert.deepEqual(buf2, [undefined, 10, 20]);

        h.undo();
        h.undo();
        h.redo();
        h.redo();
        h.undo();
        h.undo();
        h.undo();
        h.undo();
        src1.done();
        src2.done();

        assert.deepEqual(buf1, [undefined, 1, 2, 3, 2, 3, 2, 1, undefined]);
        assert.deepEqual(buf2, [undefined, 10, 20, 10, 20, 10, undefined]);
    });

});
