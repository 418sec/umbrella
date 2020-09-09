import { compareNumDesc } from "@thi.ng/compare";
import { XsAdd } from "@thi.ng/random";
import { range } from "@thi.ng/transducers";
import * as assert from "assert";
import { DCons, dcons } from "../src/index";

describe("DCons", () => {
    let a: DCons<any>, src: number[];
    beforeEach(() => {
        src = [1, 2, 3, 4, 5];
        a = dcons(src);
    });

    it("is instanceof", () => {
        assert(a instanceof DCons);
    });

    it("has length", () => {
        assert.strictEqual(a.length, 5);
        a = dcons();
        assert.strictEqual(a.length, 0);
    });

    it("is iterable", () => {
        assert.deepStrictEqual([...a], src);
    });

    it("is seqable", () => {
        assert.strictEqual(a.seq()!.first(), 1);
        // prettier-ignore
        assert.strictEqual(a.seq()!.next()!.first(), 2);
        // prettier-ignore
        assert.strictEqual(a.seq(3)!.first(), 4);
        // prettier-ignore
        assert.strictEqual(a.seq(3)!.next()!.first(), 5);
        // prettier-ignore
        assert.strictEqual(a.seq(3)!.next()!.next(), undefined);
        assert.strictEqual(a.seq(2, 2), undefined);
        assert.strictEqual(a.seq(2, 3)!.first(), 3);
        assert.strictEqual(a.seq(2, 3)!.next(), undefined);
    });

    it("shuffle", () => {
        assert.deepStrictEqual(
            [...a.shuffle(undefined, new XsAdd(0x12345678))],
            [3, 5, 1, 4, 2]
        );
        assert.deepStrictEqual(
            [...dcons(range(10)).shuffle(undefined, new XsAdd(0x12345678))],
            [3, 0, 7, 8, 5, 2, 9, 1, 6, 4]
        );
        assert.deepStrictEqual([...dcons().shuffle()], []);
        assert.deepStrictEqual([...dcons([1]).shuffle()], [1]);
    });

    it("sort", () => {
        assert.deepStrictEqual([...dcons().sort()], []);
        assert.deepStrictEqual([...dcons([1]).sort()], [1]);
        assert.deepStrictEqual([...dcons([1, -1]).sort()], [-1, 1]);
        assert.deepStrictEqual(
            [...dcons([8, -1, 17, 5, 8, 3, 11]).sort()],
            [-1, 3, 5, 8, 8, 11, 17]
        );
        assert.deepStrictEqual(
            [...dcons([8, -1, 17, 5, 8, 3, 11]).sort(compareNumDesc)],
            [17, 11, 8, 8, 5, 3, -1]
        );
    });

    it("works as stack", () => {
        assert.strictEqual(a.push(10).pop(), 10);
        assert.strictEqual(a.pop(), 5);
        a = dcons();
        assert.strictEqual(a.pop(), undefined);
    });

    it("works as queue", () => {
        assert.strictEqual(a.push(10).drop(), 1);
        assert.strictEqual(a.drop(), 2);
        assert.strictEqual(a.drop(), 3);
        assert.strictEqual(a.drop(), 4);
        assert.strictEqual(a.drop(), 5);
        assert.strictEqual(a.drop(), 10);
        assert.strictEqual(a.drop(), undefined);
    });
});
