import {
    $w,
    $x,
    $y,
    $z,
    abs,
    add,
    sub,
    Vec2Term,
    Vec3Term,
    Vec4Term,
} from "@thi.ng/shader-ast";

export const distManhattan2 = (
    a: Vec2Term | Vec3Term | Vec4Term,
    b: Vec2Term | Vec3Term | Vec4Term
) => add(abs(sub($x(a), $x(b))), abs(sub($y(a), $y(b))));

export const distManhattan3 = (
    a: Vec3Term | Vec4Term,
    b: Vec3Term | Vec4Term
) => add(distManhattan2(a, b), abs(sub($z(a), $z(b))));

export const distManhattan4 = (a: Vec4Term, b: Vec4Term) =>
    add(distManhattan3(a, b), abs(sub($w(a), $w(b))));
