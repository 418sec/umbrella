# @thi.ng/rstream-csp

[![npm (scoped)](https://img.shields.io/npm/v/@thi.ng/rstream-csp.svg)](https://www.npmjs.com/package/@thi.ng/rstream-csp)

## About

Adapter bridge between async [CSP
channels](https://github.com/thi-ng/umbrella/tree/master/packages/csp) and
synchronous stream subscriptions/transformations of
[@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/master/packages/rstream).

## Installation

```
yarn add @thi.ng/rstream-csp
```

## Usage examples

```typescript
import * as rs from "@thi.ng/rstream";
import { fromChannel } from "@thi.ng/rstream-csp";
import { Channel } from "@thi.ng/csp";

ch = new Channel();
stream = fromChannel(ch);

stream.subscribe(rs.trace("all"));
stream.subscribe(rs.trace("only evens"), tx.filter(tx.even));

ch.write(1);
// all 1

ch.write(2);
// all 2
// only evens 2

stream.subscribe(rs.trace("tentimes"), tx.map(x => x * 10));
// all 3
// tentimes 30
```

## Authors

- Karsten Schmidt <k+npm@thi.ng>

## License

&copy; 2018 Karsten Schmidt <k+npm@thi.ng> // Apache Software License 2.0
