<!-- This file is generated - DO NOT EDIT! -->

# ![@thi.ng/mime](https://media.thi.ng/umbrella/banners/thing-mime.svg?1584814354)

[![npm version](https://img.shields.io/npm/v/@thi.ng/mime.svg)](https://www.npmjs.com/package/@thi.ng/mime)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/mime.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

- [About](#about)
  - [Status](#status)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [API](#api)
- [Authors](#authors)
- [License](#license)

## About

350+ file extension to MIME type mappings, based on mime-db.

All MIME type mappings based on
[mime-db](https://github.com/jshttp/mime-db).

### Status

**ALPHA** - bleeding edge / work-in-progress

## Installation

```bash
yarn add @thi.ng/mime
```

Package sizes (gzipped): ESM: 2.4KB / CJS: 2.4KB / UMD: 2.5KB

## Dependencies

- [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/develop/packages/api)
- [tslib](https://github.com/thi-ng/umbrella/tree/develop/packages/undefined)

## API

[Generated API docs](https://docs.thi.ng/umbrella/mime/)

This package exposes a `MIME_TYPES` object which provides
mappings from file extensions to MIME types. For each extension one or
more MIME types are provided, with the default type always in first
position.

```ts
import { MIME_TYPES } from "@thi.ng/mime";

MIME_TYPES.mp3
// [ 'audio/mpeg', 'audio/mp3' ]

MIME_TYPES.jpg
// [ 'image/jpeg' ]

MIME_TYPES.jpeg
// [ 'image/jpeg' ]
```

To simplify lookup and support a fallback type, the package also has `preferredType()` function:

```ts
import { preferredType } from "@thi.ng/mime";

preferredType("mp3")
// "audio/mpeg"

// unknown file extension w/ default fallback type
preferredType("foo")
// "application/octet-stream"

// unknown file extension w/ given fallback type
preferredType("foo", "text/plain")
// "text/plain"
```

## Authors

Karsten Schmidt

## License

&copy; 2020 Karsten Schmidt // Apache Software License 2.0
