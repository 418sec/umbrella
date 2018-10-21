import * as assert from "assert";
import { MemPool, Type } from "../src/index";

describe("malloc", () => {

    let pool: MemPool;

    beforeEach(() => {
        pool = new MemPool(new ArrayBuffer(0x100));
    });

    it("malloc / free", () => {
        assert(!pool.malloc(256), "insufficient mem");
        assert(!pool.malloc(-1), "neg size");
        assert(!pool.malloc(0), "zero size");

        let a = pool.malloc(12);
        let b = pool.malloc(31);
        let c = pool.malloc(24);
        assert.equal(a, 8, "a");
        assert.equal(b, a + 16, "b");
        assert.equal(c, b + 32, "c");
        assert.equal(pool.top, c + 24, "top");

        // state check
        let stats = pool.stats();
        assert.deepEqual(stats.free, { count: 0, size: 0 });
        assert.deepEqual(stats.used, { count: 3, size: 16 + 32 + 24 });

        // free all
        assert(pool.free(a), "free a");
        assert(pool.free(c), "free b");
        assert(pool.free(b), "free c");
        assert(!pool.free(b), "free b (repeat)");
        stats = pool.stats();
        assert.equal(pool.top, 8 + 16 + 32 + 24, "top2");
        assert.deepEqual(stats.free, { count: 1, size: 16 + 32 + 24 });
        assert.deepEqual(stats.used, { count: 0, size: 0 });

        // alloc & split free block
        a = pool.malloc(32);
        assert.equal(a, 8, "a2");
        stats = pool.stats();
        assert.deepEqual(stats.free, { count: 0, size: 0 });
        assert.deepEqual(stats.used, { count: 1, size: 32 });
        assert.equal(pool.top, 40, "top3");
        // alloc next block & free prev
        b = pool.malloc(12);
        assert.equal(b, 40, "b2");
        assert(pool.free(a), "free a2");

        // re-alloc from free & split
        a = pool.malloc(8);
        assert.equal(a, 8, "a3");
        stats = pool.stats();
        assert.deepEqual(stats.free, { count: 1, size: 24 });
        assert.deepEqual(stats.used, { count: 2, size: 24 });
        assert.equal(pool.top, 56, "top4");

        // join both free blocks
        assert(pool.free(b), "free b2");

        // extend free block + top
        b = pool.malloc(64);
        assert.equal(b, 16, "b3");
        stats = pool.stats();
        assert.deepEqual(stats.free, { count: 0, size: 0 });
        assert.deepEqual(stats.used, { count: 2, size: 72 });
        assert.equal(pool.top, 80, "top5");

        // alloc below min size
        c = pool.malloc(1);

        // non-continous free chain
        assert(pool.free(c), "free c2");
        assert(pool.free(a), "free a3");
        stats = pool.stats();
        assert.deepEqual(stats.free, { count: 2, size: 16 });
        assert.deepEqual(stats.used, { count: 1, size: 64 });
        assert.equal(pool.top, 88, "top6");

        // alloc larger size to force walking free chain
        // and then alloc @ top (reuse block @ 80)
        a = pool.malloc(27);
        assert.equal(a, 80, "a4");
        stats = pool.stats();
        assert.deepEqual(stats.free, { count: 1, size: 8 });
        assert.deepEqual(stats.used, { count: 2, size: 96 });
        assert.equal(pool.top, 80 + 32, "top7");

        assert(pool.free(a), "free a4");
        assert(pool.free(b), "free b3");
        stats = pool.stats();
        assert.deepEqual(stats.free, { count: 1, size: 8 + 64 + 32 });
        assert.deepEqual(stats.used, { count: 0, size: 0 });
        assert.equal(pool.top, 8 + 8 + 64 + 32, "top8");

        pool.freeAll();
        assert.deepEqual(
            pool.stats(),
            {
                free: { count: 0, size: 0 },
                used: { count: 0, size: 0 },
                available: pool.buf.byteLength - 8,
                total: pool.buf.byteLength,
                top: 8,
            }
        );
        pool.release();
    });

    it("mallocAs", () => {
        assert.strictEqual(pool.mallocAs(Type.U8, 257), null);
        assert.strictEqual(pool.mallocAs(Type.U16, 129), null);
        assert.strictEqual(pool.mallocAs(Type.U32, 65), null);
        assert.strictEqual(pool.mallocAs(Type.F64, 33), null);
        assert.strictEqual(pool.mallocAs(Type.U8, -1), null);

        let a = pool.mallocAs(Type.F32, 3);
        let b = pool.mallocAs(Type.F64, 3);
        assert(a instanceof Float32Array, "a type");
        assert(b instanceof Float64Array, "b type");
        assert.equal(a.byteOffset, 8, "a addr");
        assert.equal(b.byteOffset, 24, "b addr");
        assert.equal(a.length, 3, "a.length");
        assert.equal(b.length, 3, "b.length");
        assert.equal(a.byteLength, 12, "a bytes");
        assert.equal(b.byteLength, 24, "b bytes");
        a.set([1, 2, 3]);
        b.set([10, 20, 30]);
        assert.deepEqual(
            new Uint32Array(pool.buf, 8, 10),
            [
                // a
                0x3f800000,
                0x40000000,
                0x40400000,
                0,
                // b
                0,
                0x40240000,
                0,
                0x40340000,
                0,
                0x403e0000
            ]
        );
        assert(pool.free(a), "free a");
        assert(pool.free(b), "free b");
        assert(!pool.free(a), "free a (repeat)");
        assert(!pool.free(b), "free b (repeat)");
        assert(!pool.free(new Uint16Array(1)), "free unmanaged");
    });

    it("callocAs", () => {
        let a = pool.callocAs(Type.F32, 3);
        let b = pool.callocAs(Type.F64, 3);
        a.set([1, 2, 3]);
        b.set([10, 20, 30]);
        assert(pool.free(a), "free a");
        assert(pool.free(b), "free b");
        // returned arrays are zeroed
        a = pool.callocAs(Type.U32, 3);
        b = pool.callocAs(Type.U32, 3);
        assert.deepEqual(a, [0, 0, 0]);
        assert.deepEqual(b, [0, 0, 0]);
    });
});
