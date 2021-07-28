# > essex build

Performs common build tasks for a library package.

**Internal Build Steps**

- TypeScript (if `tsconfig.json` is present). The output should land in `lib`
- TypeDoc (if `tsconfig.json` is present). The output should land in `dist/docs`
- Babel (from `src/` if no TypeScript, from `lib` if TypeScript was used). Output should land in `dist/esm` and `dist/cjs`
- Webpack (if `webpack.config.js` exists)

# CLI Options

- `--verbose`<br/> enables verbose mode
- `--env <env> (default=development)`<br/> sets the env to use for babel and webpack (if used)
- `--mode <mode> (default=development)`<br/> sets the mode to use in webpack (if used)
- `--docs`<br/> enable documentation generation. This is recommended for CI of open source and quality-sensitive projects.

# Details & Customization

- ## TypeScript

  ### Purpose

  Essex projects use TypeScript by default. TypeScript is a peerDependency, so projects should install their own version of TypeScript independently. Your target should be `esnext`, as babel will perform transpiling of features into the support target featureset.

  ### Customization

  TypeScript processing may be customized by using a `tsconfig.json` file.

  ## TypeDoc

  ### Purpose

  `typedoc` will emit API documentation for libraries in `dist/docs`. This is useful for library consumers in understanding how to use the library.

- ## Babel

  ### Purpose

  TypeScript has coarse output levels for browser support, and these are often insufficient for determining browser features to use and emit. To work around this, we expect TypeScript to emit `esnext`, and then use babel to down-convert bleeding-edge features to match our expected support target using `@babel/preset-env`

  ### Customization

  - `package.json::browserslist`<br/> You may define a browserslist configuration for your package. This will set the browserslist query used by the `@babel/preset-env` plugin.

  - `package.json::useBuiltIns (value='usage|entry|false', default='false')`<br/> This field allows us to configure the strategy to use for importing polyfills into our source code. Check the @babel/preset-env documentation for details on this field. By default, polyfills are not included.

  - `package.json::corejs (object)`<br/> The polyfill library to use. See the @babel/preset-env documentation for details on how this may be configured. By default it is set to `{ version: 3 }`.

  - **<packageDir>/babelrc.esm.js**<br/>
    **<packageDir>/babelrc.cjs.js**<br/>
    These configuration files will override the prescribed babel configuration.
