import { cubicFromArc as _arc, cubicFromLine as _line, cubicFromQuadratic as _quad } from "@thi.ng/geom-splines";
import { Arc } from "../api/arc";
import { Cubic } from "../api/cubic";
import { copyAttribs } from "../internal/copy-attribs";
import { pclike } from "../internal/pclike";
import type { Attribs } from "@thi.ng/geom-api";
import type { Vec } from "@thi.ng/vectors";

export function cubic(a: Vec, b: Vec, c: Vec, d: Vec, attribs?: Attribs): Cubic;
export function cubic(pts: Vec[], attribs?: Attribs): Cubic;
export function cubic(...args: any[]) {
    return pclike(Cubic, args);
}

export const cubicFromArc = (arc: Arc) =>
    _arc(arc.pos, arc.r, arc.axis, arc.start, arc.end).map(
        (c) => new Cubic(c, copyAttribs(arc))
    );

export const cubicFromLine = (a: Vec, b: Vec, attribs?: Attribs) =>
    new Cubic(_line(a, b), attribs);

export const cubicFromQuadratic = (a: Vec, b: Vec, c: Vec, attribs?: Attribs) =>
    new Cubic(_quad(a, b, c), attribs);
