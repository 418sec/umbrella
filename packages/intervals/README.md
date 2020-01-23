<!-- This file is generated - DO NOT EDIT! -->

# @thi.ng/intervals

[![npm version](https://img.shields.io/npm/v/@thi.ng/intervals.svg)](https://www.npmjs.com/package/@thi.ng/intervals)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/intervals.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

- [About](#about)
  - [Status](#status)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [API](#api)
- [Authors](#authors)
  - [Maintainer](#maintainer)
  - [Contributors](#contributors)
- [License](#license)

## About

Closed/open/semi-open interval data type, queries & operations.

Supports point & range queries and set operations with other intervals
(union, intersection, difference).

Furthermore, a parser for [ISO 80000-2 / ISO 31-11 interval
notation](https://en.wikipedia.org/wiki/ISO_31-11#Sets) is provided. See
[`Interval.parse()`](https://github.com/thi-ng/umbrella/blob/master/packages/intervals/src/index.ts#L25)
for details.

### Status

**STABLE** - used in production

## Installation

```bash
yarn add @thi.ng/intervals
```

Package sizes (gzipped): ESM: 1.4KB / CJS: 1.5KB / UMD: 1.5KB

## Dependencies

- [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/master/packages/api)
- [@thi.ng/checks](https://github.com/thi-ng/umbrella/tree/master/packages/checks)
- [@thi.ng/dlogic](https://github.com/thi-ng/umbrella/tree/master/packages/dlogic)
- [@thi.ng/errors](https://github.com/thi-ng/umbrella/tree/master/packages/errors)

## API

[Generated API docs](https://docs.thi.ng/umbrella/intervals/)

```ts
import { Interval } from "@thi.ng/intervals";

// [0 .. +∞] (fully closed)
a = Interval.withMin(0);

// [-∞ .. 1) (open on RHS)
b = Interval.withMax(1, true);

i = a.intersection(b);
i.toString();
// [0 .. 1)

// parse from string
Interval.parse("[0 .. 1)")
// Interval { l: 0, r: 1, lopen: false, ropen: true }

i.contains(1);
// false (because interval is open on RHS)

i.contains(0.999999);
// true

// classify point (true if x < LHS)
i.isBefore(-1)
// true

// classify point (true if x > RHS)
i.isAfter(1);
// true

// grow interval to include 2 => [0 ... 2]
i2 = i.include(2);

// sort order: LHS -> RHS
i.compare(i2);
// -1

// classify WRT given interval arg
i.classify(Interval.infinity());
// Classifier.SUBSET

// create transformed interval
// (here scaled around centroid)
i.map((x) => x + (x - i.centroid()) * 2);
// [-1 .. 2)

// iterator of decimated interval values
[...i.values(0.25)];
// [ 0, 0.25, 0.5, 0.75 ]

// close RHS
i.ropen = false;

[...i.values(0.25)];
// [ 0, 0.25, 0.5, 0.75, 1 ] => now includes 1
```

## Authors

### Maintainer

- Karsten Schmidt ([@postspectacular](https://github.com/postspectacular))

### Contributors

- [@oljeger](https://github.com/oljeger)

## License

&copy; 2018 - 2020 Karsten Schmidt // Apache Software License 2.0
