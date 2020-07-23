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
commitlint.config.js
webpack.override.js
tsconfig.json
package.json
lintstagedrc
prettierrc
index.js
`
const TOOLS = `
prettier-config
eslint-config
eslint-plugin
eslint
Rollup
rollup
Webpack
webpack
tsc
browserslist
commit-msg
pre-commit
commitlint
addon-actions
addon-links
addon-knobs
addon-a11y
addon-docs
TypeDoc
HTMLWebpackPlugin
DotNet
AspNet
Xamarin
audit-ci
`
const TLAs = `
BYO
API
APIs
CLI
CLIs
CVE
CVEs
CLA
CLAs
SDK
SDKs
UX
DOM
`
const JARGON = `
peerDependency
precommit
rootDir
filetypes
repo
repos
monorepo
transpiling
featureset
add-ons
env
prepended
runtime
variadic
changelog
polyfill
polyfills
ruleset
https
allowlist
denylist
formatter
config
json
init
README
2D
3D
composable
scalable
analytics
Analaytics
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
