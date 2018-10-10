import { ICopy } from "@thi.ng/api";
import { Vec } from "@thi.ng/vectors/api";
import { Vec2 } from "@thi.ng/vectors/vec2";
import {
    Attribs,
    IArcLength,
    IArea,
    IEdges,
    IPointMap
} from "./api";
import { PointContainer2 } from "./container2";
import { arcLength } from "./internal/arc-length";
import { args4 } from "./internal/args";
import { corner } from "./internal/corner";
import { edges } from "./internal/edges";

export class Quad2 extends PointContainer2 implements
    IArea,
    IArcLength,
    ICopy<Quad2>,
    IEdges<Vec2[]>,
    IPointMap<Vec2, Vec2> {

    copy() {
        return new Quad2(this._copy(), { ...this.attribs });
    }

    arcLength() {
        return arcLength(this.points, true);
    }

    area(signed = true) {
        const [a, b, c, d] = this.points;
        const area = 0.5 * (corner(a, b, c) + corner(a, c, d));
        return signed ? area : Math.abs(area);
    }

    edges() {
        return edges(this.points, true);
    }

    mapPoint(_: Readonly<Vec2>, __?: Vec2): Vec2 {
        throw new Error("TODO");
    }

    unmapPoint(q: Readonly<Vec2>, out?: Vec2) {
        const p = this.points;
        const res = Vec2.mixBilinear(p[0], p[1], p[3], p[2], q.x, q.y);
        return out ? out.set(res) : res;
    }

    toHiccup() {
        return this._toHiccup("polygon");
    }

    toJSON() {
        return this._toJSON("quad2");
    }
}

export function quad2(points: Vec, start?: number, cstride?: number, estride?: number, attribs?: Attribs): Quad2;
export function quad2(a: Vec2, b: Vec2, c: Vec2, d: Vec2, attribs?: Attribs): Quad2;
export function quad2(points: Vec2[], attribs?: Attribs): Quad2;
export function quad2(...args: any[]) {
    const [points, attribs] = args4(args);
    return new Quad2(points, attribs);
}
