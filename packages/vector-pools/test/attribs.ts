import { Type } from "@thi.ng/api";
import * as assert from "assert";
import { AttribPool } from "../src/attrib-pool";

describe("vector-pools", () => {
    it("attribs", () => {
        const pool = new AttribPool({
            mem: { size: 0x100 },
            num: 8,
            attribs: {
                pos: {
                    type: Type.F32,
                    size: 2, // 8 bytes
                    byteOffset: 0,
                    data: [[1, 2], [3, 4]]
                },
                id: {
                    type: Type.U32,
                    size: 1, // 4 bytes
                    byteOffset: 8,
                    data: [1, 2],
                    index: 4
                },
                index: {
                    type: Type.U16,
                    size: 1, // 2 bytes
                    byteOffset: 12,
                    data: [10, 20]
                },
                col: {
                    type: Type.U8,
                    size: 4, // 4 bytes
                    byteOffset: 14,
                    data: [[128, 129, 130, 131], [255, 254, 253, 252]],
                    index: 6
                }
            }
        });
        assert.deepEqual(
            [...pool.attribValues("pos")],
            [[1, 2], [3, 4], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
        );
        assert.deepEqual(
            [...pool.attribValues("id")],
            [0, 0, 0, 0, 1, 2, 0, 0]
        );
        assert.deepEqual(
            [...pool.attribValues("index")],
            [10, 20, 0, 0, 0, 0, 0, 0]
        );
        assert.deepEqual(
            [...pool.attribValues("col")],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [128, 129, 130, 131],
                [255, 254, 253, 252]
            ]
        );
    });
});
