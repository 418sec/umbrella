<!-- This file is generated - DO NOT EDIT! -->

# @thi.ng/leb128

[![npm version](https://img.shields.io/npm/v/@thi.ng/leb128.svg)](https://www.npmjs.com/package/@thi.ng/leb128)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/leb128.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

- [About](#about)
  - [Status](#status)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [API](#api)
- [Building the binary](#building-the-binary)
- [Authors](#authors)
- [License](#license)

## About

WASM based [Little Endian Base
128](https://en.wikipedia.org/wiki/LEB128) varint encoding / decoding,
supporting (u)int64 range (however for JS purposes only up to
`MAX_SAFE_INTEGER`).

The WASM binary (~660 bytes) is embedded as base64 string in the
TypeScript source to make it easier to use in both browser & node
environments. The source code of the actual implementation (written in
[Zig](https://ziglang.org)) is included in
[/src/leb128.zig](https://github.com/thi-ng/umbrella/tree/develop/packages/leb128/src/leb128.zig)

All public functions throw an error if the WASM module could not be
initialized.

References:

- https://en.wikipedia.org/wiki/LEB128
- http://webassembly.github.io/spec/core/binary/values.html#integers

### Status

**STABLE** - used in production

## Installation

```bash
yarn add @thi.ng/leb128
```

Package sizes (gzipped): ESM: 1.0KB / CJS: 1.0KB / UMD: 1.1KB

## Dependencies

- [@thi.ng/checks](https://github.com/thi-ng/umbrella/tree/develop/packages/checks)
- [@thi.ng/errors](https://github.com/thi-ng/umbrella/tree/develop/packages/errors)
- [@thi.ng/transducers-binary](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers-binary)

## API

[Generated API docs](https://docs.thi.ng/umbrella/leb128/)

```ts
import * as leb from "@thi.ng/leb128";

// if WASM is unavailable, the encode/decode functions will throw an error
enc = leb.encodeULEB128(Number.MAX_SAFE_INTEGER);
// Uint8Array [ 255, 255, 255, 255, 255, 255, 255, 15 ]

// decoding returns tuple of [value, bytes consumed]
leb.decodeULEB128(enc);
// [ 9007199254740991, 8 ]

// encode signed int
enc = leb.encodeSLEB128(Number.MIN_SAFE_INTEGER)
// Uint8Array [ 129, 128, 128, 128, 128, 128, 128, 112 ]

leb.decodeSLEB128(enc)
// [ -9007199254740991, 8 ]
```

## Building the binary

```bash
# download latest master from https://ziglang.org/download/

# first run native tests
zig test packages/leb128/src/leb128.zig
# Test 1/2 min safe integer...OK
# Test 2/2 max safe integer...OK
# All tests passed.

# compile to WASM (requires zig v0.4.0 or later)
zig build-lib -target wasm32-freestanding --release-small --strip src/leb128.zig

# apply binaryen optimizer
wasm-opt leb128.wasm -o opt.wasm -Os

# display as .wat text format
wasm2wat opt.wasm

# base64 encode and generate src/binary.ts
yarn build:binary

# test TS/JS version
yarn test
```

## Authors

Karsten Schmidt

## License

&copy; 2019 - 2020 Karsten Schmidt // Apache Software License 2.0
