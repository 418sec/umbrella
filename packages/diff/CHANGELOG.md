# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@2.0.2...@thi.ng/diff@3.0.0) (2019-01-21)


### Build System

* update package build scripts & outputs, imports in ~50 packages ([b54b703](https://github.com/thi-ng/umbrella/commit/b54b703))


### BREAKING CHANGES

* enabled multi-outputs (ES6 modules, CJS, UMD)

- build scripts now first build ES6 modules in package root, then call
  `scripts/bundle-module` to build minified CJS & UMD bundles in `/lib`
- all imports MUST be updated to only refer to package level
  (not individual files anymore). tree shaking in user land will get rid of
  all unused imported symbols.





## [2.0.2](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@2.0.1...@thi.ng/diff@2.0.2) (2018-12-15)

**Note:** Version bump only for package @thi.ng/diff





## [2.0.1](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@2.0.0...@thi.ng/diff@2.0.1) (2018-12-09)


### Performance Improvements

* **diff:** further array caching/reuse ([19b0a55](https://github.com/thi-ng/umbrella/commit/19b0a55))





# [2.0.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.1.4...@thi.ng/diff@2.0.0) (2018-12-08)


### Code Refactoring

* **diff:** flatten linear edit logs, update readme & arg order ([64feacf](https://github.com/thi-ng/umbrella/commit/64feacf))


### Features

* **diff:** add fast paths for simple cases, add tests, refactor as arrow fns ([6c6da82](https://github.com/thi-ng/umbrella/commit/6c6da82))


### Performance Improvements

* **diff:** flatten linear edit logs, rewrite diffObject(), add DiffMode ([e8356cd](https://github.com/thi-ng/umbrella/commit/e8356cd))
* **diff:** reduce amount of temp/internal array allocs (diffArray) ([d1ee6d9](https://github.com/thi-ng/umbrella/commit/d1ee6d9))


### BREAKING CHANGES

* **diff:** `ArrayDiff.linear` & `ObjectDiff.edits` now flat arrays

- see commit e8356cd296c12462ad9b126f966b55545b6ef70d
- this change drastically reduces the number of array allocations
- each ArrayDiff.linear entry consists of 3 successive items
- each ObjectDiff.edits entry constist of 2 successive items
- add `DiffMode` enum to control level of detail & internal fast paths
- update `ArrayDiff` & `ObjectDiff` types
- remove obsolete `DiffLogEntry`
- replace `diffObject` with 2.5x faster version





## [1.1.4](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.1.3...@thi.ng/diff@1.1.4) (2018-10-21)

**Note:** Version bump only for package @thi.ng/diff





## [1.1.3](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.1.2...@thi.ng/diff@1.1.3) (2018-10-17)

**Note:** Version bump only for package @thi.ng/diff





<a name="1.1.2"></a>
## [1.1.2](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.1.1...@thi.ng/diff@1.1.2) (2018-09-24)

**Note:** Version bump only for package @thi.ng/diff





<a name="1.1.1"></a>
## [1.1.1](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.1.0...@thi.ng/diff@1.1.1) (2018-09-22)

**Note:** Version bump only for package @thi.ng/diff





<a name="1.0.23"></a>
## [1.0.23](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.22...@thi.ng/diff@1.0.23) (2018-09-10)

**Note:** Version bump only for package @thi.ng/diff





<a name="1.0.22"></a>
## [1.0.22](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.21...@thi.ng/diff@1.0.22) (2018-08-24)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.21"></a>
## [1.0.21](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.20...@thi.ng/diff@1.0.21) (2018-08-01)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.20"></a>
## [1.0.20](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.19...@thi.ng/diff@1.0.20) (2018-07-20)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.19"></a>
## [1.0.19](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.18...@thi.ng/diff@1.0.19) (2018-06-21)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.18"></a>
## [1.0.18](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.17...@thi.ng/diff@1.0.18) (2018-06-18)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.17"></a>
## [1.0.17](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.16...@thi.ng/diff@1.0.17) (2018-05-14)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.16"></a>
## [1.0.16](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.15...@thi.ng/diff@1.0.16) (2018-05-14)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.15"></a>
## [1.0.15](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.14...@thi.ng/diff@1.0.15) (2018-05-13)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.14"></a>
## [1.0.14](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.13...@thi.ng/diff@1.0.14) (2018-05-12)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.13"></a>
## [1.0.13](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.12...@thi.ng/diff@1.0.13) (2018-05-10)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.12"></a>
## [1.0.12](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.11...@thi.ng/diff@1.0.12) (2018-05-10)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.11"></a>
## [1.0.11](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.10...@thi.ng/diff@1.0.11) (2018-05-09)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.10"></a>
## [1.0.10](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.9...@thi.ng/diff@1.0.10) (2018-04-30)


### Performance Improvements

* **diff:** add option to only build linear edit log ([431527a](https://github.com/thi-ng/umbrella/commit/431527a))




<a name="1.0.9"></a>
## [1.0.9](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.8...@thi.ng/diff@1.0.9) (2018-04-29)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.8"></a>
## [1.0.8](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.7...@thi.ng/diff@1.0.8) (2018-04-26)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.7"></a>
## [1.0.7](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.6...@thi.ng/diff@1.0.7) (2018-04-13)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.6"></a>
## [1.0.6](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.5...@thi.ng/diff@1.0.6) (2018-04-08)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.5"></a>
## [1.0.5](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.4...@thi.ng/diff@1.0.5) (2018-04-04)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.4"></a>
## [1.0.4](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.3...@thi.ng/diff@1.0.4) (2018-04-01)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.3"></a>
## [1.0.3](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.2...@thi.ng/diff@1.0.3) (2018-03-28)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.2"></a>
## [1.0.2](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.1...@thi.ng/diff@1.0.2) (2018-03-21)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.1"></a>
## [1.0.1](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@1.0.0...@thi.ng/diff@1.0.1) (2018-03-08)




**Note:** Version bump only for package @thi.ng/diff

<a name="1.0.0"></a>
# [1.0.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@0.1.3...@thi.ng/diff@1.0.0) (2018-02-27)


### Features

* **diff:** update diffArray, generic types ([6e0dfa1](https://github.com/thi-ng/umbrella/commit/6e0dfa1))


### BREAKING CHANGES

* **diff:** update DiffLogEntry structure




<a name="0.1.3"></a>
## [0.1.3](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@0.1.2...@thi.ng/diff@0.1.3) (2018-02-18)




**Note:** Version bump only for package @thi.ng/diff

<a name="0.1.2"></a>
## [0.1.2](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@0.1.1...@thi.ng/diff@0.1.2) (2018-02-08)




**Note:** Version bump only for package @thi.ng/diff

<a name="0.1.1"></a>
## [0.1.1](https://github.com/thi-ng/umbrella/compare/@thi.ng/diff@0.1.0...@thi.ng/diff@0.1.1) (2018-02-02)


### Performance Improvements

* **diff:** add fail fasts ([448e839](https://github.com/thi-ng/umbrella/commit/448e839))




<a name="0.1.0"></a>
# 0.1.0 (2018-02-01)


### Features

* **diff:** re-import diff package (MBP2010) ([4d0d437](https://github.com/thi-ng/umbrella/commit/4d0d437))
