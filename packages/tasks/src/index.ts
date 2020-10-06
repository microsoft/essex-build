/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { series, parallel, TaskFunction, tree } from 'gulp'
import { options, argv } from 'yargs'
import {
	generateTypedocs,
	generateTypedocsGulp,
} from '@essex/build-step-typedoc'
import {
	compileTypescript,
	emitTypings as emitTypingsTask,
} from '@essex/build-step-typescript'
import { buildBabel } from '@essex/build-step-babel'
import { rollupBuild } from '@essex/build-step-rollup'
import { storybookBuildGulp } from '@essex/build-step-storybook'
import { webpackBuildGulp } from '@essex/build-step-webpack'
import { checkCommitMessage } from '@essex/build-step-commitlint'
import { auditSecurity, auditLicenses } from '@essex/build-step-audit'
import { clean as cleanTask } from '@essex/build-step-clean'
import { jestGulp } from '@essex/build-step-jest'
import { deployTask } from './deploy'
import { condition } from '@essex/build-utils'
import { task, tscTask } from 'just-scripts'

export function preset(): Record<string, TaskFunction> {
	options({
		verbose: {
			boolean: true,
			default: false,
		},
		docs: {
			boolean: true,
			default: false,
		},
		stripInternalTypes: {
			boolean: true,
			default: false,
		},
		coverage: {
			boolean: true,
			default: false,
		},
		ci: {
			boolean: true,
			default: false,
		},
		storybook: {
			boolean: true,
			default: false,
		},
		webpack: {
			boolean: true,
			default: false,
		},
		rollup: {
			boolean: true,
			default: false,
		},
		env: {
			string: true,
			default: 'production',
			choices: ['production', 'development'],
		},
		mode: {
			string: true,
			default: 'production',
			choices: ['production', 'development'],
		},
	})

	const verbose = argv['verbose'] as boolean
	const docs = argv['docs'] as boolean
	const coverage = argv['coverage'] as boolean
	const ci = argv['ci'] as boolean
	const storybook = argv['storybook'] as boolean
	const webpack = argv['webpack'] as boolean
	const rollup = argv['rollup'] as boolean
	const stripInternalTypes = argv['stripInternalTypes'] as boolean
	const env = argv['env'] as string
	const splatArgs = argv._

	function typedocs() {
		return generateTypedocs(verbose)
	}
	function clean() {
		return cleanTask(['lib', 'dist', 'storybook_static', 'build', ...splatArgs])
	}
	const build = parallel(
		condition(typedocs, docs),
		emitTypingsTask(stripInternalTypes),
		series(tscTask(), buildBabel(env)),
	)

	task('clean', clean)
	task('build', build)

	// option('jestClearCache', { boolean: true })
	// option('jestUpdateSnapshots', { boolean: true })
	// option('jestCoverageThreshold', { number: true })
	// option('jestBrowser', { boolean: true })
	// option('jestConfigFile', { string: true })
	// option('deployStorageAccount', { string: true })
	// option('deployStorageAccountKey', { string: true })
	// option('deployType', { string: true })
	return {
		build,
	}
	// task('test', () =>
	// 	jestGulp({
	// 		verbose: argv()['verbose'],
	// 		coverage: argv()['coverage'],
	// 		watch: argv()['watch'],
	// 		ci: argv()['ci'],
	// 		clearCache: argv()['jestClearCache'],
	// 		updateSnapshots: argv()['jestUpdateSnapshots'],
	// 		coverageThreshold: argv()['jestCoverageThreshold'],
	// 		browser: argv()['jestBrowser'],
	// 		configFile: argv()['jestConfigFile'],
	// 	}),
	// )

	// task('audit_security', auditSecurity)
	// task('audit_licenses', auditLicenses)
	// task('audit', parallel('audit_security', 'audit_licenses'))

	// task('bundle_storybook', storybookBuildGulp)
	// task('bundle_webpack', () =>
	// 	webpackBuildGulp({
	// 		env: argv()['env'],
	// 		mode: argv()['mode'],
	// 		verbose: argv()['verbose'],
	// 	}),
	// )
	// task('bundle_rollup', rollupBuild)
	// task(
	// 	'bundle',
	// 	parallel(
	// 		condition('bundle_storybook', argv()['storybook']),
	// 		condition('bundle_webpack', argv()['webpack']),
	// 		condition('bundle_rollup', argv()['rollup']),
	// 	),
	// )

	// task('clean', () => cleanTask(argv()['cleanFiles']()))

	// task('commit-msg', checkCommitMessage)

	// task('deploy', () =>
	// 	deployTask({
	// 		verbose: argv()['verbose'],
	// 		type: argv()['deployType'],
	// 		storageAccount: argv()['deployStorageAccount'],
	// 		storageAccountKey: argv()['deployStorageAccountKey'],
	// 	}),
	// )
}
