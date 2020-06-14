import { delay } from "../src";

import * as assert from "assert";

describe("delay", () => {
    it("only executes once", () => {
        let num = 0;
        const a = delay(() => ++num);
        assert(!a.isRealized());
        assert.equal(a.deref(), 1);
        assert.equal(a.deref(), 1);
        assert(a.isRealized());
    });
});
