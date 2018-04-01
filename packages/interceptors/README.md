# @thi.ng/interceptors

[![npm (scoped)](https://img.shields.io/npm/v/@thi.ng/interceptors.svg)](https://www.npmjs.com/package/@thi.ng/interceptors)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

## About

Interceptor based event, side effect & immutable state handling.

## Installation

```
yarn add @thi.ng/interceptors
```

## Usage examples

```typescript
import * as interceptors from "@thi.ng/interceptors";
```

### Event bus, interceptors, side effects

Description forthcoming. Please check the detailed commented source code
and examples for now:

- [/src/event-bus.ts](https://github.com/thi-ng/umbrella/tree/master/packages/interceptors/src/event-bus.ts)

Introductory:

- [/examples/interceptor-basics](https://github.com/thi-ng/umbrella/tree/master/examples/interceptor-basics) | [live demo](http://demo.thi.ng/umbrella/interceptor-basics)
- [/examples/async-effect](https://github.com/thi-ng/umbrella/tree/master/examples/async-effect) | [live demo](http://demo.thi.ng/umbrella/async-effect)

Advanced:

- [/examples/router-basics](https://github.com/thi-ng/umbrella/tree/master/examples/router-basics) | [live demo](http://demo.thi.ng/umbrella/router-basics)

- [create-hdom-app](https://github.com/thi-ng/create-hdom-app) Yarn project generator. Uses: @thi.ng/atom + hdom + interceptors + router

## Authors

- Karsten Schmidt

## License

&copy; 2018 Karsten Schmidt // Apache Software License 2.0
