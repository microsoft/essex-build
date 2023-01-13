# JavaScript Software Development Standards

The goal of this document is to describe how our team’s projects are typically structured. This includes normative tooling and structure for different kinds of software (e.g. libraries vs applications), and what typical flows a developer should expect to be available.


## Goals and Principles
* __Consistent__ workflow across projects
* __Familiar__ to developers, and easy to adopt
* __Fast__ CI/CD and development/testing workflows. To support this principle, we transpile and bundle code _as little as possible_ and support dev-loops that only use source code.
* __Fail Fast__ CI/CD pipeline should fail as soon as possible instead of waiting until pipeline completion to report failures.
* __Modern__ We lean into stable, modern features of the JavaScript ecosystem, including TypeScript, ESM, and modern language features.
* __Encourage Frequence Committing__ by lowering bars to checking in code and pushing branches. In the past we employed a suite of pre-commit verification, but this discouraged developers from committing code in a partially working state. This ended up being needless friction, especially since our CI/CD pipelines are relatively fast.

## Project Structure
Our projects are structured as monorepos using Yarn 3+ (or whatever is latest). Our software is usually composed of many moving parts: libraries, demo applications, full-blown applications, test suites, and more. To manage these in a single repository, we use Yarn workspaces.

### JavaScript-Only Monorepos
For single-language monorepos, workspaces are created under the `packages` folder. For example, a monorepo with a library and a demo application would look like this:

```text
- packages
	- my-library
		- package.json
	- my-demo
		- package.json
```

### Multi-Language Monorepos
When authoring monorepos with multiple languages, Yarn workspaces are created under the `javascript` folder, and other languages would follow a similar pattern. For example, a monorepo with a library, demo application, and a Go backend would look like this:

```text
- javascript
  - my-library
		- package.json
	- my-demo
		- package.json
- python
	- my-backend
		- pyproject.toml
```

The rest of this document will focus primarily on JavaScript.

## Common Build Tasks
The following top-level tasks expected to exist in all JavaScript projects. Tasks that are marked `fully parallel` are expected to be defined in each relevant project, and they are safe to execute concurrently. Tasks marked `sequenced` may perform a chain of operations in order to achieve an end. Tasks marked `topologically-sorted` are not-quite fully parallelizable and need to be run in topological order.

We also indicate at what times these scripts are expected to be used: 
* _Dev Time_ - during day-to-day development on a local machine or Codespaces VM.
* _CI/CD Time_ - these tasks are executed during in CI/CD pipelines during branch and PR verification.
* _Release Time_ - these tasks are executed during the release process, and are not expected to be executed during CI/CD pipelines.

### Tasks

* __clean__ (fully parallel, Dev, Release Time) 
This task cleans the project, removing any artifacts or temporary files.

* __release__ (sequenced, Release Time) 
This task applies semver changes, executes build verification, and publishes artifacts to the package registry.

* __ci__ (sequenced, CI/CD Time) 
This task is used to chain together an end-to-end verification suite. It should run all tests, linting, and other verification tasks.

* __start__ (fully parallel, Dev Time) 
This task starts any webapps or servers in the project in development mode.

* __build__ (topologically-sorted, Dev Time)
This task builds artifacts and performs typechecking for library packages within the project.

* __test__ (fully parallel, Dev Time)
This task runs all tests in the project. This could be a sequencing of unit tests, integration tests, and end-to-end tests. If so, `unit_test` and `integration_test` tasks should be defined for developer convenience to execute these tasks in isolation.

* __check__ - (fully parallel, Dev Time)
This task checks code for linting and formatting issues. Other checks may be performed here as well, which may turn this task into a sequenced task, in which case `check_packages` should be provided as a parallelized task.

* __fix__ (fully parallel, Dev Time)
This task checks code for linting and formatting issues and attempts to fix as many as possible. Other checks may be performed here as well, which may turn this task into a sequenced task, in which case `fix_packages` should be provided as a parallelized task.

* __update_sdks__ (Dev Time)
This is a utility command that's occasionally used to update yarn sdks (e.g. `yarn dlx @yarnpkg/sdks vscode`)

* _version check_ (CI/CD + Dev Time)
`yarn version check` is provided by the `yarn version` plugin and is used to check the semver impact of a PR. The CI/CD pipelines will use `yarn version check` to check for SemVer impact documents, and developers use `yarn version check --interactive` to author SemVer impact documents. At release time, these documents are flattened into a single version bump for each package and removed as resolved.

* _is_clean_ (CI/CD Time)
This task is used at the end of CI/CD to verify that the git index is clean and that no code modifications have been made by the build system. The standard script is `"is_clean": "essex git-is-clean"`

## CI Tasks
* Code Verification (e.g. `yarn ci`) - perform basic code verification across the project. This task should also verify that the git repository is clean when it is finished.
* SemVer Verification (e.g. `yarn version check`)
* website/docsite release processes


## Tooling
The following tools are used to manage monorepos.

### Yarn
As mentioned above, we use Yarn workspaces to manage monorepos. Yarn is a package manager for JavaScript, and is used to install dependencies, run scripts, and more. Yarn is also used to manage the monorepo, and is the primary tool used to run scripts and commands.

#### Key, idiomatic, Yarn features
* _PnP_ - Plug and Play is a feature of Yarn that allows dependencies to be accessed without the need for a `node_modules` folder. This is a huge benefit for CI/CD and development workflows, as it allows the entire dependency graph to be cached and shared. It also allows dependencies to be accessed without the need for a filesystem traversal, which is faster than the traditional `node_modules` approach.
* _publishConfig_ - This field in `package.json` allows for configuration fields to override default values in `package.json`. This allows us to point our packages at the `src/` folder at development-time, and then overriding that with artifacts in the `dist/` folder during release.
* _Version plugin_ - we use the yarn version plugin to track semver impact of PRs over time. This allows us to have a more predictable release flow. 

### TurboRepo (optional, recommended)
Turborepo is a monorepo orchestration tool that is used to order script execution across workspaces. In the past we have used the `yarn workspaces` plugin for task orchestration. `turborepo` benefits from a task cache, which improves local development time and CI/CD time. It also is more efficient with scheduling asynchronous tasks and modeling their execution into a parallel-execution pipeline by topologically sorting the dag of tasks.

### TypeScript (required)
Our frontend code, with very few exceptions, is written in TypeScript. Libraries are required to ship types for client consumption.

### essex-scripts (required) 
The essex build system provides a consistent entry-point for our tooling and allows us to define common top-level tasks and sequencing. It provides some key benefits for our development team: 

* Fast builds using native toolchains - our builds use `swc` internally and our bundling configuration uses `swc` and `esbuild` to optimize bundle times. We also use `swc-jest` for improving test performance.
* CJS/ESM/Dual Support - our builds can support multiple modes of shipping JavaScript packages, depending on the goals of the library.
* Documentation Generation - our builds can emit markdown-based documentation using `api-extractor`. This can act as public API documentation for our libraries.
* Prescriptive Configurations - for common tools like Jest, eslint, webpack, Vite, and others.

### Jest (required) 
Jest is our test runner of choice. It is fast, well-maintained, and has a great community around it. We use `swc-jest` to improve test performance.

### Playwright (optional, recommended for projects going beyond experimental phases)
Playwright is a browser automation library that allows us to run end-to-end tests for our applications. It is ergonomic and well-maintained.

### eslint (required)
eslint is our current default linter. We provide a default team configuration: `@essex/eslint-config`. 

### prettier (optional - but a formatter is required)
prettier has been our default formatter, and is executed in essex scripts under the `essex lint` command. We provide a default team configuration: `@essex/prettier-config`. Projects may opt into using `rome` for formatting instead.

### rome (optional - but a formatter is required)
Rome is an emerging JavaScript linter and formatter that is built using native toolchains. It is extremely fast, and can be used as a replacement for `prettier`, but it does not have as rich of a library of linter rules as eslint. We currently recommend that if it is used, that it is used in-tandem with `eslint` using the `@essex/eslint-config/rome` configuration.