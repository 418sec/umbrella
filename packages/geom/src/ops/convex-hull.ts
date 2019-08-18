import { IObjectOf } from "@thi.ng/api";
import { defmulti, Implementation1 } from "@thi.ng/defmulti";
import { IShape, PCLike, Type } from "@thi.ng/geom-api";
import { grahamScan2 } from "@thi.ng/geom-hull";
import { Polygon } from "../api/polygon";
import { dispatch } from "../internal/dispatch";
import { vertices } from "./vertices";

export const convexHull = defmulti<IShape, IShape>(dispatch);

convexHull.addAll(<IObjectOf<Implementation1<unknown, IShape>>>{
    [Type.GROUP]: ($: IShape) => new Polygon(vertices($), { ...$.attribs }),

    [Type.POINTS]: ($: PCLike) =>
        new Polygon(grahamScan2($.points), { ...$.attribs }),

    [Type.TRIANGLE]: ($: IShape) => $.copy()
});

convexHull.isa(Type.CIRCLE, Type.TRIANGLE);
convexHull.isa(Type.ELLIPSE, Type.TRIANGLE);
convexHull.isa(Type.POLYGON, Type.POINTS);
convexHull.isa(Type.POLYLINE, Type.POINTS);
convexHull.isa(Type.QUAD, Type.POINTS);
convexHull.isa(Type.RECT, Type.TRIANGLE);
