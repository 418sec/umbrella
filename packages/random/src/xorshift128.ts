import { ARandom } from "./arandom";
import type { IBuffered, ICopy } from "@thi.ng/api";
import type { ISeedable } from "./api";

// https://en.wikipedia.org/wiki/Xorshift

const DEFAULT_SEED = [0xdecafbad, 0x2fa9d75b, 0xe41f67e3, 0x5c83ec1a];

export class XorShift128 extends ARandom
    implements
        IBuffered<Uint32Array>,
        ICopy<XorShift128>,
        ISeedable<ArrayLike<number>> {
    buffer: Uint32Array;

    constructor(seed: ArrayLike<number> = DEFAULT_SEED) {
        super();
        this.buffer = new Uint32Array(4);
        this.seed(seed);
    }

    copy() {
        return new XorShift128(this.buffer);
    }

    bytes() {
        return new Uint8Array(this.buffer.buffer);
    }

    seed(seed: ArrayLike<number>) {
        this.buffer.set(seed);
        return this;
    }

    int() {
        const s = this.buffer;
        let t = s[3];
        let w;
        t ^= t << 11;
        t ^= t >>> 8;
        s[3] = s[2];
        s[2] = s[1];
        w = s[1] = s[0];
        return (s[0] = (t ^ w ^ (w >>> 19)) >>> 0);
    }
}
