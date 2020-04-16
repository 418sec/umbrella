import * as assert from "assert";
import { defContext, FLOAT } from "../src";

describe("parse", () => {
    it("float", () => {
        [
            "1",
            "-1",
            "+1",
            "1.",
            "1.01",
            ".1",
            "-.1",
            "1.2e3",
            "-1.2e-3",
            ".1e+3",
            "-1-",
        ].forEach((x) => {
            const ctx = defContext(x);
            assert(FLOAT(ctx), x);
            assert.equal(ctx.scope.children![0].result, parseFloat(x), x);
        });
    });
});
