# @thi.ng/resolve-map

[![npm (scoped)](https://img.shields.io/npm/v/@thi.ng/resolve-map.svg)](https://www.npmjs.com/package/@thi.ng/resolve-map)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

## About

DAG resolution of vanilla objects & arrays with internally linked
values. This is useful for expressing complex configurations with
derived values or computing interrelated values without having to
specify the order of computations.

It's common practice to use nested JS objects for configuration
purposes. Frequently some values in the object are copies or derivatives
of other values, which can lead to mistakes during refactoring and / or
duplication of effort.

To avoid these issues, this library provides the ability to define
single sources of truth, create references (links) to these values and
provide a resolution mechanism to recursively expand their real values
and / or compute derived values. Both absolute & relative references are
supported.

## API

### `resolveMap(obj)`

Visits all key-value pairs in depth-first order for given object or
array, expands any reference values, mutates the original object and
returns it. Cyclic references are not allowed or checked for and if
present will cause a stack overflow error. However, refs pointing to
other refs are recursively resolved (again, provided there are no
cycles).

Reference values are special strings representing lookup paths of other
values in the object and are prefixed with `@` for relative refs or
`@/` for absolute refs and both using `/` as path separator (Note:
trailing slashes are NOT allowed!). Relative refs are resolved from
currently visited object and support "../" prefixes to access any parent
levels. Absolute refs are always resolved from the root level (the
original object passed to this function).

```ts
resolveMap({a: 1, b: {c: "@d", d: "@/a"} })
// { a: 1, b: { c: 1, d: 1 } }
```

If a value is a function, it is called using two possible conventions:

1) If the user function uses ES6 object destructuring for its first
   argument, the given object keys are resolved prior to calling the
   function and the resolved values provided as first argument and a
   general `resolve` function as second argument.
2) If no de-structure form is found in the function's arguments, the
   function is only called with `resolve` as argument.

**Important:** Since ES6 var names can't contain special characters,
destructured keys are ALWAYS looked up as siblings of the currently
processed value.

```ts
// `c` uses ES6 destructuring form to look up `a` & `b` values
{a: 1, b: 2, c: ({a,b}) => a + b }
=>
// { a: 1, b: 2, c: 3 }
```

The single arg `resolve` function accepts a path (**without `@`
prefix**) to look up any other values in the object. The return value of
the user provided function is used as final value for that key in the
object. This mechanism can be used to compute derived values of other
values stored anywhere in the root object. **Function values will always
be called only once.** Therefore, in order to associate a function as
final value to a key, it MUST be wrapped with an additional function, as
shown for the `e` key in the example below. Similarly, if an actual
string value should happen to start with `@`, it needs to be wrapped in
a function (see `f` key below).

```ts
// `a` is derived from 1st array element in `b.d`
// `b.c` is looked up from `b.d[0]`
// `b.d[1]` is derived from calling `e(2)`
// `e` is a wrapped function
// `f` is wrapped to ignore `@` prefix
res = resolveMap({
  a: (resolve) => resolve("b/c") * 100,
  b: { c: "@d/0", d: [2, (resolve) => resolve("../../e")(2) ] },
  e: () => (x) => x * 10,
  f: () => "@foo",
})
// { a: 200, b: { c: 2, d: [ 2, 20 ] }, e: [Function], f: "@foo" }

res.e(2);
// 20
```

## Installation

```
yarn add @thi.ng/resolve-map
```

## Dependencies

- [@thi.ng/checks](https://github.com/thi-ng/umbrella/tree/master/packages/checks)
- [@thi.ng/errors](https://github.com/thi-ng/umbrella/tree/master/packages/errors)
- [@thi.ng/paths](https://github.com/thi-ng/umbrella/tree/master/packages/paths)

## Usage examples

### Statistical analysis

In this example we construct a graph to compute a number of statistical
properties for some numeric input array. The graph is a plain object of
possibly dependent functions, which can be specified in any order. Each
function accepts a "resolver" function as argument (`$`) to look up and
execute other computations. Each computation is only executed once.

```ts
import { resolveMap } from "@thi.ng/resolve-map";
import * as tx from "@thi.ng/transducers";

// define object of interrelated computations
// the `$` arg passed to each fn is the resolver
// the `src` key is still missing here and will be
// provided later
const stats = {
    // sequence average
    mean: ({src}) => tx.reduce(tx.mean(), src),
    // sequence range
    range: ({min,max}) => max - min,
    // computes sequence min val
    min: ({src}) => tx.reduce(tx.min(), src),
    // computes sequence max val
    max: ({src}) => tx.reduce(tx.max(), src),
    // sorted copy
    sorted: ({src}) => [...src].sort((a, b) => a - b),
    // standard deviation
    sd: ({src, mean})=>
        Math.sqrt(
            tx.transduce(tx.map((x) => Math.pow(x - mean, 2)), tx.add(), src) /
            (src.length - 1)),
    // compute 10th - 90th percentiles
    percentiles: ({sorted}) => {
        return tx.transduce(
            tx.map((x) => sorted[Math.floor(x / 100 * sorted.length)]),
            tx.push(),
            tx.range(10, 100, 5)
        );
    }
};

// inject some source data to analyze

// Note: we wrap the data as function to avoid `resolveMap`
// attempting to resolve each array item as well. this is
// purely for performance reasons and would also work without
// wrapping.

// Note 2: If the `stats` graph is meant to be re-usable in
// the future you MUST use the spread operator to create a
// shallow copy, because `resolveMap` mutates the given object
resolveMap({...stats, src: () => [ 1, 6, 7, 2, 4, 11, -3 ]})
// {
//     mean: 4,
//     range: 14,
//     min: -3,
//     max: 11,
//     sorted: [ -3, 1, 2, 4, 6, 7, 11 ],
//     sd: 4.546060565661952,
//     percentiles: [ -3, 1, 2, 2, 4, 6, 6, 7, 11 ],
//     src: [ 1, 6, 7, 2, 4, 11, -3 ]
// }
```

### Theme configuration

```typescript
import { resolveMap } from "@thi.ng/resolve-map";

resolveMap({
    colors: {
        bg: "white",
        text: "black",
        selected: "red",
    },
    main: {
        fontsizes: [12, 16, 20]
    },
    button: {
        bg: "@/colors/text",
        label: "@/colors/bg",
        // resolve with abs path inside fn
        fontsize: (resolve) => `${resolve("/main/fontsizes/0")}px`,
    },
    buttonPrimary: {
        bg: "@/colors/selected",
        label: "@/button/label",
        // resolve with relative path inside fn
        fontsize: (resolve) => `${resolve("../main/fontsizes/2")}px`,
    }
});
// {
//     colors: {
//         bg: "white",
//         text: "black",
//         selected: "red"
//     },
//     main: {
//         fontsizes: [ 12, 16, 20 ]
//     },
//     button: {
//         "bg": "black",
//         "label": "white",
//         "fontsize": "12px"
//     },
//     buttonPrimary: {
//         bg: "red",
//         label: "black",
//         fontsize: "20px"
//     }
// }
```

## Authors

- Karsten Schmidt

## License

&copy; 2018 Karsten Schmidt // Apache Software License 2.0
