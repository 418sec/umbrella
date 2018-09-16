# hdom-canvas-shapes

[Live demo](http://demo.thi.ng/umbrella/hdom-canvas-shapes/)

This example demonstrates different features of the upcoming
[@thi.ng/hdom-canvas](https://github.com/thi-ng/umbrella/tree/feature/hdom-canvas/packages/hdom-canvas)
package to declare canvas scenegraphs using the same hiccup syntax as
the rest of the UI. These shape elements (children of the `canvas`
component) are defined via a SVG-like approach (though not using
stringified geometry) and, using the new branch-local behavior feature
of
[@thi.ng/hdom](https://github.com/thi-ng/umbrella/tree/feature/hdom-canvas/packages/hdom),
are translated into canvas API draw calls. Shapes can be grouped and any
attributes defined on group nodes will be inherited by all children
(same as in SVG).

Furthermore, this example acts as a test bed for
[@thi.ng/hiccup-svg](https://github.com/thi-ng/umbrella/tree/feature/hdom-canvas/packages/hiccup-svg)'s
`convertTree()` function to translate and then serialize these scene
trees to downloadable SVG files.

See the [@thi.ng/hdom-canvas
readme](https://github.com/thi-ng/umbrella/tree/feature/hdom-canvas/packages/hdom-canvas)
for further details.

Related examples:

- [hdom-canvas-clock](https://github.com/thi-ng/umbrella/tree/feature/hdom-canvas/examples/hdom-canvas-clock)

Dataflow diagram:

![dataflow](https://raw.githubusercontent.com/thi-ng/umbrella/feature/hdom-canvas/assets/hdom-canvas-shapes.png)

## Building

Because some of the packages used by this demo are still unreleased,
it's currently only possible to build from source...

The example project also assumes that [Parcel](https://parceljs.org) is
installed globally.

```bash
git clone https://github.com/thi-ng/umbrella.git
cd umbrella
git checkout feature/hdom-canvas
yarn install
yarn build
cd examples/hdom-canvas-shapes
yarn start
```

## Authors

- Karsten Schmidt

## License

&copy; 2018 Karsten Schmidt // Apache Software License 2.0
