<!-- This file is generated - DO NOT EDIT! -->

# @thi.ng/geom-subdiv-curve

[![npm version](https://img.shields.io/npm/v/@thi.ng/geom-subdiv-curve.svg)](https://www.npmjs.com/package/@thi.ng/geom-subdiv-curve)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/geom-subdiv-curve.svg)
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

Freely customizable, iterative nD subdivision curves for open / closed geometries.

Based in principle on:

- [Generating subdivision curves with L−systems on a
  GPU](http://algorithmicbotany.org/papers/subgpu.sig2003.pdf)
- Clojure version of [thi.ng/geom](http://thi.ng/geom).

Supplied / implemented subdivision schemes:

- Split @ midpoints (open / closed)
- Split @ thirds (open / closed)
- Chaikin (open / closed)
- Cubic (closed only)

| Chaikin (closed)                                        | Chaikin (open)                                      |
|---------------------------------------------------------|-----------------------------------------------------|
| ![chaikin closed](../../assets/geom/chaikin-closed.svg) | ![chaikin open](../../assets/geom/chaikin-open.svg) |

### Status

**STABLE** - used in production

## Installation

```bash
yarn add @thi.ng/geom-subdiv-curve
```

## Dependencies

- [@thi.ng/geom-api](https://github.com/thi-ng/umbrella/tree/master/packages/geom-api)
- [@thi.ng/transducers](https://github.com/thi-ng/umbrella/tree/master/packages/transducers)
- [@thi.ng/vectors](https://github.com/thi-ng/umbrella/tree/master/packages/vectors)

## API

[Generated API docs](https://docs.thi.ng/umbrella/geom-subdiv-curve/)

```ts
import * as gsc from "@thi.ng/geom-subdiv-curve";

gsc.subdivide([[0,0], [100,0], [100,100], [0,100]], gsc.SUBDIV_CHAIKIN_CLOSED, 4)
```

## Authors

Karsten Schmidt

## License

&copy; 2016 - 2019 Karsten Schmidt // Apache Software License 2.0
