# @thi.ng/atom

[![npm (scoped)](https://img.shields.io/npm/v/@thi.ng/atom.svg)](https://www.npmjs.com/package/@thi.ng/atom)

## About

Clojure inspired mutable wrappers for (usually) immutable values, with support
for watches, cursors (direct access to nested values), undo/redo history.

## Installation

```
yarn add @thi.ng/atom
```

## Usage examples

A complete minimal webapp example is in the
[/examples/todo-list](https://github.com/thi-ng/umbrella/tree/master/examples/todo-list)
directory.

[Live demo here](http://demo.thi.ng/umbrella/hiccup-dom/todo-list/)

### Atom

```typescript
import * as atom from "@thi.ng/atom";

const a = new atom.Atom(23);

// obtain value via deref()
a.deref();
// 23

// add watch to observe value changes
a.addWatch("foo", (id, prev, curr) => console.log(`${id}: ${prev} -> ${curr}`));
// true

a.swap((val)=> val + 1);
// foo: 23 -> 24

a.reset(42);
// foo: 24 -> 42
```

### Cursor

Cursors provide direct & immutable access to a nested value within a structured
atom. The path to the desired value must be provided when the cursor is
created. The path is then compiled into a [getter and setter](./src/path.ts) to
allow cursors to be used like atoms and update the parent state in an immutable
manner (i.e. producing an optimized copy with structural sharing of the
original (as much as possible)) - see further details below.

**It's important to remember** that cursors also cause their parent state (atom or
another cursor) to reflect their updated local state. I.e. any change to a
cursor's value propagates up the hierarchy of parent states.

```typescript
a = new atom.Atom({a: {b: {c: 1}}})
// cursor to `b` value
b=new atom.Cursor(a, "a.b")
// cursor to `c` value, relative to `b`
c=new atom.Cursor(b, "c")

c.reset(2);

b.deref();
// { c: 2 }

a.deref();
// { a: { b: { c: 2 } } }
```

For that reason, it's recommended to design the overall data layout rather wide
than deep (my personal limit is 3-4 levels) to minimize the length of the
propagation chain and maximize structural sharing.

```typescript
// main state
main = new atom.Atom({ a: { b: { c: 23 }, d: { e: 42 } }, f: 66 });

// cursor to `c` value
cursor = new atom.Cursor(main, "a.b.c");
// or
cursor = new atom.Cursor(main, ["a","b","c"]);

// alternatively provide path implicitly via lookup & update functions
// both fns will be called with cursor's parent state
// this allows the cursor implementation to work with any data structure
// as long as the updater DOES NOT mutate in place
cursor = new atom.Cursor(
    main,
    (s) => s.a.b.c,
    (s, x) => ({...s, a: {...s.a, b: {...s.a.b, c: x}}})
);

// add watch just as with Atom
cursor.addWatch("foo", console.log);

cursor.deref()
// 23

cursor.swap(x => x + 1);
// foo 23 24

main.deref()
// { a: 24, b: 42 }
```

### Undo history

```typescript
// the History can be used with & behaves like an Atom or Cursor
// but creates snapshots of current state before applying new state
// by default history has length of 100 steps, but is configurable
db = new atom.History(new atom.Atom({a: 1}))
db.deref()
// {a: 1}

db.reset({a: 2, b: 3})
db.reset({b: 4})

db.undo()
// {a: 2, b: 3}

db.undo()
// {a: 1}

db.undo()
// undefined (no more undo possible)
db.canUndo()
// false

db.redo()
// {a: 2, b: 3}

db.redo()
// {b: 4}

db.redo()
// undefined (no more redo possible)

db.canRedo()
// false
```

### Getters & setters

The `getter()` and `setter()` functions transform a path like `a.b.c` into a
function operating directly at the value the path points to in nested object.
For getters, this essentially compiles to `val = obj.a.b.c`.

The resulting setter function too accepts a single object to operate on and
when called, **immutably** replaces the value at the given path, i.e. produces
a selective deep copy of obj up until given path. If any intermediate key is
not present in the given object, it creates a plain empty object for that
missing key and descends further along the path.

```typescript
s = setter("a.b.c");
// or
s = setter(["a","b","c"]);

s({a: {b: {c: 23}}}, 24)
// {a: {b: {c: 24}}}

s({x: 23}, 24)
// { x: 23, a: { b: { c: 24 } } }

s(null, 24)
// { a: { b: { c: 24 } } }
```

Only keys in the path will be modied, all other keys present in the given
object retain their original values to provide efficient structural sharing /
re-use. This is the same *behavior* as in Clojure's immutable maps or those
provided by ImmutableJS (albeit those implementation are completely different -
they're using trees, we're using the ES6 spread op and recursive functional
composition to produce the setter).

```typescript
s = setter("a.b.c");

// original
a = { x: { y: { z: 1 } }, u: { v: 2 } };
// updated version
b = s(a, 3);
// { x: { y: { z: 1 } }, u: { v: 2 }, a: { b: { c: 2 } } }

// verify anything under keys `x` & `u` is still identical
a.x === b.x // true
a.x.y === b.x.y // true
a.u === b.u; // true
```

## Authors

- Karsten Schmidt

## License

&copy; 2018 Karsten Schmidt // Apache Software License 2.0
