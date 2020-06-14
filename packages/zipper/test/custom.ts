import * as assert from "assert";
import { Location, zipper } from "../src";

interface Branch {
    type: "root" | "branch";
    children: Node[];
}
interface Leaf {
    type: "leaf";
    value: number;
}

type Node = Branch | Leaf;

describe("custom", () => {
    let tree: Branch;
    let a: Location<Node>;
    beforeEach(() => {
        tree = {
            type: "root",
            children: [
                {
                    type: "branch",
                    children: [
                        { type: "leaf", value: 1 },
                        { type: "leaf", value: 2 },
                    ],
                },
                { type: "leaf", value: 3 },
                {
                    type: "branch",
                    children: [
                        { type: "leaf", value: 4 },
                        {
                            type: "branch",
                            children: [{ type: "leaf", value: 5 }],
                        },
                    ],
                },
            ],
        };
        a = zipper<Node>(
            {
                branch: (x) => x.type !== "leaf",
                children: (x) => (<Branch>x).children,
                factory: (src, children) => ({
                    type: (<Branch>src).type,
                    children,
                }),
            },
            tree
        );
    });

    it("next", () => {
        assert.deepEqual(a.node, tree);
        assert.deepEqual(a.next!.node, tree.children[0]);
        assert.deepEqual(
            a.next!.next!.node,
            (<any>tree).children[0].children[0]
        );
        assert.deepEqual(
            a.next!.next!.next!.node,
            (<any>tree).children[0].children[1]
        );
        assert.deepEqual(
            a.next!.next!.next!.next!.node,
            (<any>tree).children[1]
        );
        assert.deepEqual(
            a.next!.next!.next!.next!.next!.node,
            (<any>tree).children[2]
        );
        assert.deepEqual(
            a.next!.next!.next!.next!.next!.next!.node,
            (<any>tree).children[2].children[0]
        );
        assert.deepEqual(
            a.next!.next!.next!.next!.next!.next!.next!.node,
            (<any>tree).children[2].children[1]
        );
        assert.deepEqual(
            a.next!.next!.next!.next!.next!.next!.next!.next!.node,
            (<any>tree).children[2].children[1].children[0]
        );
        assert.deepEqual(
            a.next!.next!.next!.next!.next!.next!.next!.next!.next,
            undefined
        );
    });

    it("replace", () => {
        assert.deepEqual(
            a.next!.next!.next!.replace({ type: "leaf", value: 10 }).up!.root,
            {
                type: "root",
                children: [
                    {
                        type: "branch",
                        children: [
                            { type: "leaf", value: 1 },
                            { type: "leaf", value: 10 },
                        ],
                    },
                    ...tree.children.slice(1),
                ],
            }
        );
        assert.deepEqual(
            a.next!.rightmost.down!.right!.down!.replace({
                type: "leaf",
                value: 10,
            }).up!.root,
            {
                type: "root",
                children: [
                    ...tree.children.slice(0, 2),
                    {
                        type: "branch",
                        children: [
                            { type: "leaf", value: 4 },
                            {
                                type: "branch",
                                children: [{ type: "leaf", value: 10 }],
                            },
                        ],
                    },
                ],
            }
        );
    });
});
