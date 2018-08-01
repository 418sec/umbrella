export type BinOp = (a: number, b: number) => number;

const ADD = (a: number, b: number) => a + b;
const SUB = (a: number, b: number) => a - b;
const MUL = (a: number, b: number) => a * b;
const DIV = (a: number, b: number) => a / b;

export class SparseVec {

    public static fromDense(dense: ArrayLike<number>) {
        const sparse: number[] = [],
            n = dense.length;
        for (let i = 0; i < n; i++) {
            const v = dense[i];
            v !== 0 && sparse.push(i, v);
        }
        return new SparseVec(n, sparse);
    }

    public m: number;
    public data: number[];

    constructor(m: number, data?: number[]) {
        this.m = m;
        this.data = data || [];
    }

    public copy() {
        return new SparseVec(this.m, this.data.slice());
    }

    public get nnz() {
        return this.data.length >>> 1;
    }

    public get(m: number, safe = true) {
        safe && this.ensureIndex(m);
        const d = this.data;
        for (let i = 0, n = d.length; i < n && d[i] <= m; i += 2) {
            if (m === d[i]) {
                return d[i + 1];
            }
        }
        return 0;
    }

    public set(m: number, v: number, safe = true) {
        safe && this.ensureIndex(m);
        const d = this.data;
        for (let i = 0, n = d.length; i < n; i += 2) {
            if (m < d[i]) {
                v !== 0 && d.splice(i, 0, m, v);
                return this;
            } else if (m === d[i]) {
                v !== 0 ? (d[i + 1] = v) : d.splice(i, 2);
                return this;
            }
        }
        v !== 0 && d.push(m, v);
        return this;
    }

    public binopN(op: BinOp, n: number) {
        const d = this.data,
            m = this.m,
            res = [];
        for (let i = 0, j = 0, k = d[j]; i < m; i++) {
            let v = op(i === k ? (j += 2, k = d[j], d[j - 1]) : 0, n);
            v !== 0 && res.push(i, v);
        }
        return new SparseVec(this.m, res);
    }

    public binop(op: BinOp, v: SparseVec) {
        this.ensureSize(v);
        const da = this.data,
            db = v.data,
            res = [];
        for (let i = 0, j = 0, la = da.length, lb = db.length; i < la || j < lb;) {
            const ia = da[i], ib = db[j];
            if (ia === ib) {
                const v = op(da[i + 1], db[j + 1]);
                v !== 0 && res.push(ia, v);
                i += 2;
                j += 2;
            } else {
                if (ib === undefined || ia < ib) {
                    const v = op(da[i + 1], 0);
                    v !== 0 && res.push(ia, v);
                    i += 2;
                } else {
                    const v = op(0, db[j + 1]);
                    v !== 0 && res.push(ib, v);
                    j += 2;
                }
            }
        }
        return new SparseVec(this.m, res);
    }

    public add(v: SparseVec) {
        return this.binop(ADD, v);
    }

    public sub(v: SparseVec) {
        return this.binop(SUB, v);
    }

    public mul(v: SparseVec) {
        return this.binop(MUL, v);
    }

    public div(v: SparseVec) {
        return this.binop(DIV, v);
    }

    public addN(n: number) {
        return this.binopN(ADD, n);
    }

    public subN(n: number) {
        return this.binopN(SUB, n);
    }

    public mulN(n: number) {
        const d = this.data,
            l = d.length,
            res = new Array(l);
        for (let i = 0; i < l; i += 2) {
            res[i] = d[i];
            res[i + 1] = d[i + 1] * n;
        }
        return new SparseVec(this.m, res);
    }

    public divN(n: number) {
        const d = this.data,
            l = d.length,
            res = new Array(l);
        for (let i = 0; i < l; i += 2) {
            res[i] = d[i];
            res[i + 1] = d[i + 1] / n;
        }
        return new SparseVec(this.m, res);
    }

    public dot(v: SparseVec) {
        this.ensureSize(v);
        const da = this.data,
            db = v.data;
        let res = 0;
        for (let i = da.length - 2, j = db.length - 2; i >= 0 && j >= 0;) {
            const ia = da[i], ib = db[j];
            if (ia === ib) {
                res += da[i + 1] * db[j + 1];
                i -= 2;
                j -= 2;
            } else {
                (ia > ib) ? i -= 2 : j -= 2;
            }
        }
        return res;
    }

    public magSquared() {
        const d = this.data;
        let mag = 0;
        for (let i = d.length - 1; i >= 1; i -= 2) {
            mag += d[i] * d[i];
        }
        return mag;
    }

    public mag() {
        return Math.sqrt(this.magSquared());
    }

    public normalize(n = 1) {
        const mag = this.magSquared();
        if (mag > 1e-9) {
            n /= Math.sqrt(mag);
            const d = this.data;
            for (let i = d.length - 1; i >= 1; i -= 2) {
                d[i] *= n;
            }
        }
        return this;
    }

    public toDense() {
        const res = new Array(this.m).fill(0),
            d = this.data;
        for (let i = d.length - 2; i >= 0; i -= 2) {
            res[d[i]] = d[i + 1];
        }
        return res;
    }

    protected ensureIndex(m: number) {
        if (m < 0 || m >= this.m) {
            throw new Error(`index out of bounds: ${m}`);
        }
    }
    protected ensureSize(v: SparseVec) {
        if (this.m !== v.m) {
            throw new Error(`wrong vector size: ${v.m}`);
        }
    }
}
