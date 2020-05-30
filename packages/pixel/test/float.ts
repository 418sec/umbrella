import * as assert from "assert";
import { FLOAT_GRAY, FLOAT_RGBA, FLOAT_GRAY_ALPHA, FLOAT_RGB } from "../src";

describe("float", () => {
    it("FLOAT_GRAY", () => {
        assert.deepEqual(FLOAT_GRAY.fromABGR(0x80333333), [0.2]);
        assert.deepEqual(FLOAT_GRAY.fromABGR(0x80666666), [0.4]);
        assert.deepEqual(FLOAT_GRAY.fromABGR(0x80999999), [0.6]);
        assert.deepEqual(FLOAT_GRAY.fromABGR(0x80cccccc), [0.8]);
        assert.deepEqual(FLOAT_GRAY.fromABGR(0x80ffffff), [1]);
        assert.equal(FLOAT_GRAY.toABGR([0.25]), 0xff404040);
        assert.equal(FLOAT_GRAY.toABGR([0.5]), 0xff808080);
        assert.equal(FLOAT_GRAY.toABGR([0.75]), 0xffbfbfbf);
    });

    it("FLOAT_GRAY_ALPHA", () => {
        assert.deepEqual(FLOAT_GRAY_ALPHA.fromABGR(0x80333333), [
            0.2,
            0.5019607843137255,
        ]);
        assert.deepEqual(FLOAT_GRAY_ALPHA.fromABGR(0x666666), [0.4, 0]);
        assert.deepEqual(FLOAT_GRAY_ALPHA.fromABGR(0xff999999), [0.6, 1]);
        assert.equal(FLOAT_GRAY_ALPHA.toABGR([0.25, 0]), 0x00404040);
        assert.equal(FLOAT_GRAY_ALPHA.toABGR([0.5, 0.5]), 0x80808080);
        assert.equal(FLOAT_GRAY_ALPHA.toABGR([0.75, 1]), 0xffbfbfbf);
    });

    it("FLOAT_RGB", () => {
        assert.deepEqual(FLOAT_RGB.fromABGR(0x80336699), [0.6, 0.4, 0.2]);
        assert.deepEqual(FLOAT_RGB.fromABGR(0xff00ff00), [0, 1, 0]);
        assert.equal(FLOAT_RGB.toABGR([0.6, 0.4, 0.2]), 0xff336699);
        assert.equal(FLOAT_RGB.toABGR([0, 1, 0]), 0xff00ff00);
    });

    it("FLOAT_RGBA", () => {
        assert.deepEqual(FLOAT_RGBA.fromABGR(0x80336699), [
            0.6,
            0.4,
            0.2,
            0.5019607843137255,
        ]);
        assert.deepEqual(FLOAT_RGBA.fromABGR(0xff00ff00), [0, 1, 0, 1]);
        assert.equal(FLOAT_RGBA.toABGR([0.6, 0.4, 0.2, 0.5]), 0x80336699);
        assert.equal(FLOAT_RGBA.toABGR([0, 1, 0, 1]), 0xff00ff00);
    });
});
