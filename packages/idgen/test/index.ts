import * as assert from "assert";
import { EVENT_ADDED, EVENT_REMOVED, IDGen } from "../src";

describe("idgen", () => {
    it("re-use (versioned)", () => {
        const g = new IDGen(8);
        assert.equal(g.next(), 0);
        assert.equal(g.next(), 1);
        assert.equal(g.next(), 2);
        assert(g.free(1));
        assert(g.free(2));
        assert.equal(g.next(), 0x102);
        assert.equal(g.next(), 0x101);
        assert.equal(g.next(), 3);
        assert(g.free(0));
        assert(!g.free(0));
        assert.equal(g.next(), 0x100);
        assert(g.free(0x100));
        assert(g.free(3));
        assert.equal((<any>g).freeID, 0x103);
        assert(g.free(0x101));
        assert(g.free(0x102));
        assert.equal((<any>g).freeID, 0x202);
        assert.deepEqual((<any>g).ids, [-1, 0x103, 0x201, 0x200]);
    });

    it("has (unversioned)", () => {
        const check = (expected: boolean[]) => {
            for (let i = 0; i < 4; i++) {
                i > 0 && assert(!g.has(-i), String(-i));
                assert.equal(g.has(i), expected[i], String(i));
                assert(!g.has(i + 4), String(i + 4));
            }
        };

        const g = new IDGen(2, 0);
        assert.equal(g.available, 4);
        g.next();
        g.next();
        g.next();
        g.next();
        assert.equal(g.available, 0);
        assert.throws(() => g.next(), "max cap");
        check([true, true, true, true]);
        g.free(2);
        assert.equal(g.available, 1);
        check([true, true, false, true]);
        g.free(1);
        assert.equal(g.available, 2);
        check([true, false, false, true]);
        g.free(0);
        assert.equal(g.available, 3);
        check([false, false, false, true]);
        g.next();
        check([true, false, false, true]);
        g.next();
        check([true, true, false, true]);
        g.free(3);
        check([true, true, false, false]);
        g.next();
        check([true, true, false, true]);
        g.next();
        check([true, true, true, true]);
        assert.throws(() => g.next(), "max cap 2");
    });

    it("has (versioned)", () => {
        const check = (ids: number[], expected: boolean[]) => {
            for (let i = 0; i < 4; i++) {
                assert.equal(g.has(ids[i]), expected[i], String(i));
                assert.equal(g.has(ids[i]), expected[i], String(ids[i]));
            }
        };

        const g = new IDGen(2, 1);
        g.next();
        g.next();
        g.next();
        g.next();
        assert.throws(() => g.next(), "max cap");
        check([0, 1, 2, 3], [true, true, true, true]);
        check([0 + 4, 1 + 4, 2 + 4, 3 + 4], [false, false, false, false]);
        g.free(2);
        check([0, 1, 2, 3], [true, true, false, true]);
        check([0, 1, 2 + 4, 3], [true, true, false, true]);
        g.free(1);
        check([0, 1, 2, 3], [true, false, false, true]);
        check([0, 1 + 4, 2 + 4, 3], [true, false, false, true]);
        g.free(0);
        check([0, 1, 2, 3], [false, false, false, true]);
        check([0 + 4, 1 + 4, 2 + 4, 3], [false, false, false, true]);
        g.next();
        check([0, 1 + 4, 2 + 4, 3], [false, false, false, true]);
        check([0 + 4, 1 + 4, 2 + 4, 3], [true, false, false, true]);
        g.free(0 + 4);
        check([0 + 4, 1 + 4, 2 + 4, 3], [false, false, false, true]);
        // 0 version wraparound
        g.next();
        check([0, 1 + 4, 2 + 4, 3], [true, false, false, true]);
        check([0 + 4, 1 + 4, 2 + 4, 3], [false, false, false, true]);
        g.next();
        check([0, 1 + 4, 2 + 4, 3], [true, true, false, true]);
        g.next();
        check([0, 1 + 4, 2 + 4, 3], [true, true, true, true]);
        g.free(0);
        g.free(1 + 4);
        g.free(2 + 4);
        g.free(3);
        check([0, 1, 2, 3], [false, false, false, false]);
        check([0 + 4, 1 + 4, 2 + 4, 3 + 4], [false, false, false, false]);
        assert.equal((<any>g).freeID, 3 + 4);
    });

    it("notify", () => {
        const added: number[] = [];
        const removed: number[] = [];
        const g = new IDGen(8);
        g.addListener(EVENT_ADDED, ({ value }) => added.push(value));
        g.addListener(EVENT_REMOVED, ({ value }) => removed.push(value));
        g.next();
        g.next();
        g.free(0);
        g.free(1);
        g.next();
        g.next();
        g.free(0x100);
        g.free(0x101);
        assert.deepEqual(added, [0, 1, 0x101, 0x100]);
        assert.deepEqual(removed, [0, 1, 0x100, 0x101]);
    });

    it("grow capacity", () => {
        const g = new IDGen(1, 0);
        g.next();
        g.next();
        assert.throws(() => g.next());
        g.capacity = 4;
        g.next();
        g.next();
        assert.throws(() => g.next());
        assert.equal(g.capacity, 4);
        assert.equal((<any>g).mask, 3);
        assert.equal((<any>g).shift, 2);
        const g2 = new IDGen(1);
        assert.throws(() => (g2.capacity = 4));
    });

    it("clear", () => {
        const g = new IDGen(8, 0, 256, 128);
        assert.equal(g.available, 128);
        assert.equal(g.next(), 128);
        assert.equal(g.next(), 129);
        assert.equal(g.available, 126);
        g.clear();
        assert.equal(g.available, 128);
        assert.equal(g.used, 0);
        assert.equal(g.next(), 128);
    });
});
