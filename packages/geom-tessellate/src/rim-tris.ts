import { Tessellator } from "@thi.ng/geom-api";
import {
    comp,
    map,
    partition,
    push,
    transduce,
    wrap,
    zip
} from "@thi.ng/transducers";
import { mixN, ReadonlyVec, Vec } from "@thi.ng/vectors";

export const rimTris: Tessellator = (points: ReadonlyVec[]) => {
    const edgeCentroids = transduce(
        comp(partition<Vec>(2, 1), map((e) => mixN([], e[0], e[1], 0.5))),
        push<Vec>(),
        wrap(points, 1, false, true)
    );
    return transduce(
        comp(partition<Vec[]>(2, 1), map((t) => [t[0][0], t[1][1], t[1][0]])),
        push(),
        [edgeCentroids],
        wrap([...zip(edgeCentroids, points)], 1, true, false)
    );
};
