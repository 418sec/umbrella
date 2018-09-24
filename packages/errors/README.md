# @thi.ng/errors

[![npm version](https://img.shields.io/npm/v/@thi.ng/errors.svg)](https://www.npmjs.com/package/@thi.ng/errors)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/errors.svg)
![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

## About

Custom error types and helper fns used by many packages in this repo.

This feature was previously part of the
[@thi.ng/api](https://github.com/thi-ng/umbrella/tree/master/packages/api)
package.

## Installation

```bash
yarn add @thi.ng/errors
```

## Dependencies

None

## Usage examples

```ts
import * as err from "@thi.ng/errors";

err.illegalArity(3)
// Error: illegal arity: 3

err.illegalArgs("expected foo");
// Error: illegal argument(s): expected foo

err.illegalState("oops");
// Error: illegal state: oops

err.unsupported("TODO not yet implemented")
// Error: unsupported operation: TODO not yet implemented
```

## Authors

- Karsten Schmidt

## License

&copy; 2018 Karsten Schmidt // Apache Software License 2.0
