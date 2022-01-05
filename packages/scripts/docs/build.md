# > essex build

Performs common build tasks for a library package.

**Internal Build Steps**

- Type-Checking and Type Emissions. The output should land in `dist/types`
- TypeDoc (if --docs flag is present). The output should land in `dist/docs`
- Transpilation. Output should land in `dist/esm` and `dist/cjs`

# CLI Options

- `--verbose`<br/> enables verbose mode
- `--docs`<br/> enable documentation generation. This is recommended for CI of open source and quality-sensitive projects.
- `--stripInternalTypes`<br/> removes internally-marked typings declarations from documentation

# Details & Customization

- ## TypeScript

  ### Purpose

  TypeScript is utilized to verify package typings, and to emit typings for package consumers to utilize.

  ### Customization

  TypeScript processing may be customized by using a `tsconfig.json` file.

- ## SWC

  ### Purpose

  SWC is utilized to perform end-to-end transpilation into the target module systems (dist/cjs, dist/esm).

  ### Customization

  A .swcrc file may be defined in the package root that will be utilized during transpilation. This can be customized with specific transformations and presets using `@babel/preset-env` configurations.

- ## TypeDoc

  ### Purpose

  `typedoc` will emit API documentation for libraries in `dist/docs`. This is useful for library consumers in understanding how to use the library.
