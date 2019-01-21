# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.30...@thi.ng/router@1.0.0) (2019-01-21)


### Build System

* update package build scripts & outputs, imports in ~50 packages ([b54b703](https://github.com/thi-ng/umbrella/commit/b54b703))


### BREAKING CHANGES

* enabled multi-outputs (ES6 modules, CJS, UMD)

- build scripts now first build ES6 modules in package root, then call
  `scripts/bundle-module` to build minified CJS & UMD bundles in `/lib`
- all imports MUST be updated to only refer to package level
  (not individual files anymore). tree shaking in user land will get rid of
  all unused imported symbols.





## [0.1.30](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.29...@thi.ng/router@0.1.30) (2018-12-15)

**Note:** Version bump only for package @thi.ng/router





## [0.1.29](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.28...@thi.ng/router@0.1.29) (2018-12-08)

**Note:** Version bump only for package @thi.ng/router





## [0.1.28](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.27...@thi.ng/router@0.1.28) (2018-11-13)

**Note:** Version bump only for package @thi.ng/router





## [0.1.27](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.26...@thi.ng/router@0.1.27) (2018-10-21)

**Note:** Version bump only for package @thi.ng/router





## [0.1.26](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.25...@thi.ng/router@0.1.26) (2018-10-17)

**Note:** Version bump only for package @thi.ng/router





<a name="0.1.25"></a>
## [0.1.25](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.24...@thi.ng/router@0.1.25) (2018-09-24)

**Note:** Version bump only for package @thi.ng/router





<a name="0.1.24"></a>
## [0.1.24](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.24-alpha.0...@thi.ng/router@0.1.24) (2018-09-22)

**Note:** Version bump only for package @thi.ng/router





<a name="0.1.24-alpha.0"></a>
## [0.1.24-alpha.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.23...@thi.ng/router@0.1.24-alpha.0) (2018-09-17)

**Note:** Version bump only for package @thi.ng/router





<a name="0.1.23"></a>
## [0.1.23](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.22...@thi.ng/router@0.1.23) (2018-09-10)

**Note:** Version bump only for package @thi.ng/router





<a name="0.1.22"></a>
## [0.1.22](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.21...@thi.ng/router@0.1.22) (2018-09-01)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.21"></a>
## [0.1.21](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.20...@thi.ng/router@0.1.21) (2018-08-24)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.20"></a>
## [0.1.20](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.19...@thi.ng/router@0.1.20) (2018-08-01)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.19"></a>
## [0.1.19](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.18...@thi.ng/router@0.1.19) (2018-07-20)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.18"></a>
## [0.1.18](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.17...@thi.ng/router@0.1.18) (2018-06-21)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.17"></a>
## [0.1.17](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.16...@thi.ng/router@0.1.17) (2018-06-18)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.16"></a>
## [0.1.16](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.15...@thi.ng/router@0.1.16) (2018-05-14)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.15"></a>
## [0.1.15](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.14...@thi.ng/router@0.1.15) (2018-05-14)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.14"></a>
## [0.1.14](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.13...@thi.ng/router@0.1.14) (2018-05-13)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.13"></a>
## [0.1.13](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.12...@thi.ng/router@0.1.13) (2018-05-12)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.12"></a>
## [0.1.12](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.11...@thi.ng/router@0.1.12) (2018-05-10)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.11"></a>
## [0.1.11](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.10...@thi.ng/router@0.1.11) (2018-05-10)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.10"></a>
## [0.1.10](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.9...@thi.ng/router@0.1.10) (2018-05-09)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.9"></a>
## [0.1.9](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.8...@thi.ng/router@0.1.9) (2018-04-29)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.8"></a>
## [0.1.8](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.7...@thi.ng/router@0.1.8) (2018-04-26)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.7"></a>
## [0.1.7](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.6...@thi.ng/router@0.1.7) (2018-04-26)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.6"></a>
## [0.1.6](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.5...@thi.ng/router@0.1.6) (2018-04-13)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.5"></a>
## [0.1.5](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.4...@thi.ng/router@0.1.5) (2018-04-08)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.4"></a>
## [0.1.4](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.3...@thi.ng/router@0.1.4) (2018-04-04)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.3"></a>
## [0.1.3](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.2...@thi.ng/router@0.1.3) (2018-04-01)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.2"></a>
## [0.1.2](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.1...@thi.ng/router@0.1.2) (2018-03-28)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.1"></a>
## [0.1.1](https://github.com/thi-ng/umbrella/compare/@thi.ng/router@0.1.0...@thi.ng/router@0.1.1) (2018-03-21)




**Note:** Version bump only for package @thi.ng/router

<a name="0.1.0"></a>
# 0.1.0 (2018-03-11)


### Features

* **router:** re-import router package (MBP2010), minor refactor & fixes ([07b4e06](https://github.com/thi-ng/umbrella/commit/07b4e06))
