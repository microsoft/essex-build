/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const projectDictionaryPath = join(process.cwd(), '.spelling')
const projectDictionary = existsSync(projectDictionaryPath)
	? readFileSync(projectDictionaryPath, { encoding: 'utf-8' }).toString()
	: ''

const ACTUAL_WORDS = `
inclusivity
e.g.
embeddings
`
const TEAM = `
essex
Essex
`
const LEGALESE = `
MERCHANTABILITY
NONINFRINGEMENT
`
const CORP = `
microsoft.com
cla.opensource.microsoft.com
msrc
msrc.microsoft.com
opencode@microsoft.com
secure@microsoft.com
PowerBI
`
const CONFIGS = `
.docsrc
.docsignore
eslintignore
eslintrc
babelrc.esm.js
babelrc.cjs.js
webpack.override.js
tsconfig.json
package.json
lintstagedrc
prettierrc
index.js
`
const TOOLS = `
addon-a11y
addon-actions
addon-docs
addon-knobs
addon-links
ArrayBuffer
AspNet
audit-ci
browserslist
bundler
commit-msg
commitlint
CommonJS
DotNet
ECMAScript
eslint
eslint-config
eslint-plugin
HTMLWebpackPlugin
JavaScript
pre-commit
prettier-config
rollup
Rollup
SharedArrayBuffer
tsc
TypeDoc
TypeScript
webpack
Webpack
WebGL
WebGL2
Xamarin
`
const TLAs = `
API
APIs
BYO
CLA
CLAs
CLI
CLIs
CVE
CVEs
DOM
SDK
SDKs
UI
UIs
UX
UXs
`
const JARGON = `
2D
3D
add-ons
allowlist
Analaytics
analytics
changelog
composable
config
denylist
env
featureset
filetypes
formatter
https
init
json
monorepo
peerDependency
polyfill
polyfills
precommit
prepended
README
renderer
renderers
repo
repos
rootDir
ruleset
runtime
scalable
transpiling
variadic
deployable
pnpm
npm
lockfile
`
const dictionary = `
${ACTUAL_WORDS}
${CORP}
${LEGALESE}
${TEAM}
${TOOLS}
${JARGON}
${TLAs}
${CONFIGS}
${projectDictionary}
`
export default dictionary
