<!-- This file is generated - DO NOT EDIT! -->

# ![@thi.ng/rstream-log-file](https://media.thi.ng/umbrella/banners/thing-rstream-log-file.svg?1582660668)

[![npm version](https://img.shields.io/npm/v/@thi.ng/rstream-log-file.svg)](https://www.npmjs.com/package/@thi.ng/rstream-log-file)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/rstream-log-file.svg)
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

File output handler for structured, multilevel & hierarchical loggers based on [@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream). This is a support package for [@thi.ng/rstream-log](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream-log).

### Status

**STABLE** - used in production

## Installation

```bash
yarn add @thi.ng/rstream-log-file
```

Package sizes (gzipped): ESM: 0.1KB / CJS: 0.2KB / UMD: 0.3KB

## Dependencies

- [@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream)

## API

[Generated API docs](https://docs.thi.ng/umbrella/rstream-log-file/)

```ts
import * as log from "@thi.ng/rstream-log";
import { writeFile } from "@thi.ng/rstream-log-file";

const logger = new log.Logger("main");

// add file output w/ post-filtering (only WARN or ERROR levels)
// and formatted as JSON
const writer = logger
    .transform(log.minLevel(log.Level.WARN), log.formatJSON())
    .subscribe(writeFile("main.log"));

logger.warn("eek!");

// appended to file:
// {"level":"WARN","id":"main","time":"2018-01-23T09:05:55.647Z","body":["eek!"]}

// optionally, cancel file writer
writer.done();
```

## Authors

Karsten Schmidt

## License

&copy; 2017 - 2020 Karsten Schmidt // Apache Software License 2.0
