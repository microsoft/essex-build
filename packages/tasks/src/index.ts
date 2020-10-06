/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { task, series, parallel, option, argv, condition } from 'just-scripts'
import { generateTypedocsGulp } from '@essex/build-step-typedoc'
import { compileTypescript, emitTypings } from '@essex/build-step-typescript'
import { buildBabel } from '@essex/build-step-babel'
import { rollupBuild } from '@essex/build-step-rollup'
import { storybookBuildGulp } from '@essex/build-step-storybook'
import { webpackBuildGulp } from '@essex/build-step-webpack'
import { checkCommitMessage } from '@essex/build-step-commitlint'
import { auditSecurity, auditLicenses } from '@essex/build-step-audit'
import { clean as cleanTask } from '@essex/build-step-clean'
import { jestGulp } from '../../scripts/node_modules/@essex/build-step-jest/lib'
import { deployTask } from './deploy'

option('verbose')
option('stripInternalTypes')
option('env')
option('mode')
option('docs')
option('coverage')
option('ci')
option('storybook')
option('webpack')
option('rollup')
option('cleanFiles')
option('jestClearCache')
option('jestUpdateSnapshots')
option('jestCoverageThreshold')
option('jestBrowser')
option('jestConfigFile')
option('deployStorageAccount')
option('deployStorageAccountKey')
option('deployType')

task('typedocs', () => generateTypedocsGulp(argv()['verbose']))
task('typings', () => emitTypings(argv()['stripInternalTypes']))
task('tsc', compileTypescript())
task('babel', buildBabel(argv()['env']))

task('build', () =>
	parallel(
		condition('typedocs', argv()['docs']),
		'tyings',
		series('tsc', 'babel'),
	),
)

task('test', () =>
	jestGulp({
		verbose: argv()['verbose'],
		coverage: argv()['coverage'],
		watch: argv()['watch'],
		ci: argv()['ci'],
		clearCache: argv()['jestClearCache'],
		updateSnapshots: argv()['jestUpdateSnapshots'],
		coverageThreshold: argv()['jestCoverageThreshold'],
		browser: argv()['jestBrowser'],
		configFile: argv()['jestConfigFile'],
	}),
)

task('audit_security', auditSecurity)
task('audit_licenses', auditLicenses)
task('audit', parallel('audit_security', 'audit_licences'))

task('bundle_storybook', storybookBuildGulp())
task('bundle_webpack', () =>
	webpackBuildGulp({
		env: argv()['env'],
		mode: argv()['mode'],
		verbose: argv()['verbose'],
	}),
)
task('bundle_rollup', rollupBuild)
task(
	'bundle',
	parallel(
		condition('bundle_storybook', argv()['storybook']),
		condition('bundle_webpack', argv()['webpack']),
		condition('bundle_rollup', argv()['rollup']),
	),
)

task('clean', () => cleanTask(argv()['cleanFiles']()))

task('commit-msg', checkCommitMessage)

task('deploy', () =>
	deployTask({
		verbose: argv()['verbose'],
		type: argv()['deployType'],
		storageAccount: argv()['deployStorageAccount'],
		storageAccountKey: argv()['deployStorageAccountKey'],
	}),
)
