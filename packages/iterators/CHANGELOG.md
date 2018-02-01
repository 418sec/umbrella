# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="4.0.3"></a>
## [4.0.3](https://github.com/thi-ng/umbrella/compare/@thi.ng/iterators@4.0.2...@thi.ng/iterators@4.0.3) (2018-02-01)




**Note:** Version bump only for package @thi.ng/iterators

<a name="4.0.2"></a>
## [4.0.2](https://github.com/thi-ng/umbrella/compare/@thi.ng/iterators@4.0.1...@thi.ng/iterators@4.0.2) (2018-01-31)




**Note:** Version bump only for package @thi.ng/iterators

<a name="4.0.1"></a>
## [4.0.1](https://github.com/thi-ng/umbrella/compare/@thi.ng/iterators@4.0.0...@thi.ng/iterators@4.0.1) (2018-01-30)




**Note:** Version bump only for package @thi.ng/iterators

<a name="4.0.0"></a>
# [4.0.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/iterators@3.2.4...@thi.ng/iterators@4.0.0) (2018-01-29)


### Code Refactoring

* **iterators:** remove default exports ([651d07c](https://github.com/thi-ng/umbrella/commit/651d07c))


### BREAKING CHANGES

* **iterators:** switch back to named function exports for project consistency
and following lead from tslint (https://palantir.github.io/tslint/rules/no-default-export/)




<a name="3.2.4"></a>
## [3.2.4](https://github.com/thi-ng/umbrella/compare/@thi.ng/iterators@3.2.3...@thi.ng/iterators@3.2.4) (2018-01-29)




**Note:** Version bump only for package @thi.ng/iterators

<a name="3.2.3"></a>
## [3.2.3](https://github.com/thi-ng/umbrella/compare/@thi.ng/iterators@3.2.2...@thi.ng/iterators@3.2.3) (2018-01-28)




**Note:** Version bump only for package @thi.ng/iterators

# @thi.ng/iterators changelog

## 3.1.0 (2017-12-12)

- Add `groupBy()`
- Add optional key fn for `frequencies()`
- Update package structure (build commands & target dirs)

## 3.0.1 (2017-07-30)

- Update readme

## 3.0.0 (2017-07-30)

- Package name change `thing-iterators` => `@thi.ng/iterators`
- Add `fork()`
- Breaking change `cached()` API (now same as `fork()`)

## 2.0.0 (2017-07-07)

- All functions are defined as sub-modules and exposed as default exports. This is an additional feature. The full library can still be imported as before.
- Function sub-modules use *Kebab case* whereas function names are in *Camel case*.
