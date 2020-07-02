/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { merge, pick, isFunction } from 'lodash'
import * as resolveFrom from 'resolve-from'
import * as resolveGlobal from 'resolve-global'

const load = require('@commitlint/load').default
const lint = require('@commitlint/lint').default
const read = require('@commitlint/read').default

export interface CommitLintArgs {
	config?: string
	cwd?: string
	edit?: string
	/* check message in the file at path given by environment variable value */
	env?: string
	color?: boolean

	/** array of shareable configurations to extend */
	extends?: string
	/** upper end of the commit range to lint; applies if edit=false */
	to?: string
	verbose?: boolean

	/** toggle console output */
	quiet?: boolean

	/** configuration preset to use for conventional-commits-parser */
	'parser-preset'?: string

	/** output format of the results */
	format?: string

	/** lower end of the commit range to lint; applies if edit=false */
	from?: string

	/** helpurl in error message */
	'help-url'?: string
}

export async function commitlint(inputFlags: CommitLintArgs) {
	const flags = normalizeFlags(inputFlags)

	const range = pick(flags, 'edit', 'from', 'to')

	const input = read(range, { cwd: flags.cwd })

	const messages = (Array.isArray(input) ? input : [input])
		.filter(message => typeof message === 'string')
		.filter(message => message.trim() !== '')
		.filter(Boolean)

	if (messages.length === 0 && !checkFromRepository(flags)) {
		const err = new Error(
			'[input] is required: --env or --edit or --from and --to',
		)
		console.log(err.message)
		throw err
	}

	const loadOpts = { cwd: flags.cwd, file: flags.config }
	const loaded = await load(getSeed(flags), loadOpts)
	const parserOpts = selectParserOpts(loaded.parserPreset)
	const opts: any = {
		parserOpts: {},
		plugins: {},
		ignores: [],
		defaultIgnores: true,
	}
	if (parserOpts) {
		opts.parserOpts = parserOpts
	}
	if (loaded.plugins) {
		opts.plugins = loaded.plugins
	}
	if (loaded.ignores) {
		opts.ignores = loaded.ignores
	}
	if (loaded.defaultIgnores === false) {
		opts.defaultIgnores = false
	}
	const format = loadFormatter(loaded, flags)

	// Strip comments if reading from `.git/COMMIT_EDIT_MSG`
	if (range.edit) {
		opts.parserOpts.commentChar = '#'
	}

	const results = await Promise.all(
		messages.map(message => lint(message, loaded.rules, opts)),
	)

	if (Object.keys(loaded.rules).length === 0) {
		let input = ''

		if (results.length !== 0) {
			const originalInput = results[0].input
			input = originalInput
		}

		results.splice(0, results.length, {
			valid: false,
			errors: [
				{
					level: 2,
					valid: false,
					name: 'empty-rules',
					message: [
						'Please add rules to your `commitlint.config.js`',
						'    - Getting started guide: https://git.io/fhHij',
						'    - Example config: https://git.io/fhHip',
					].join('\n'),
				},
			],
			warnings: [],
			input,
		})
	}

	const report = results.reduce(
		(info, result) => {
			info.valid = result.valid ? info.valid : false
			info.errorCount += result.errors.length
			info.warningCount += result.warnings.length
			info.results.push(result)

			return info
		},
		{
			valid: true,
			errorCount: 0,
			warningCount: 0,
			results: [],
		},
	)

	const output: string = format(report, {
		color: flags.color,
		verbose: flags.verbose,
	})

	if (!flags.quiet && output !== '') {
		console.log(output)
	}

	if (!report.valid) {
		const err = new Error(output)
		throw err
	}
}

function checkFromRepository(flags: CommitLintArgs) {
	return checkFromHistory(flags) || checkFromEdit(flags)
}

function checkFromEdit(flags: CommitLintArgs) {
	return Boolean(flags.edit) || flags.env
}

function checkFromHistory(flags: CommitLintArgs) {
	return typeof flags.from === 'string' || typeof flags.to === 'string'
}

function normalizeFlags(flags: CommitLintArgs) {
	const edit = getEditValue(flags)
	return merge({}, flags, { edit, e: edit })
}

function getEditValue(flags: CommitLintArgs) {
	if (flags.env) {
		if (!(flags.env in process.env)) {
			throw new Error(
				`Recieved '${flags.env}' as value for -E | --env, but environment variable '${flags.env}' is not available globally`,
			)
		}
		return process.env[flags.env]
	}
	const { edit } = flags
	// If the edit flag is set but empty (i.e '-e') we default
	// to .git/COMMIT_EDITMSG
	if (edit === '') {
		return true
	}
	if (typeof edit === 'boolean') {
		return edit
	}
	// The recommended method to specify -e with husky was `commitlint -e $HUSKY_GIT_PARAMS`
	// This does not work properly with win32 systems, where env variable declarations
	// use a different syntax
	// See https://github.com/conventional-changelog/commitlint/issues/103 for details
	// This has been superceded by the `-E GIT_PARAMS` / `-E HUSKY_GIT_PARAMS`
	const isGitParams = edit === '$GIT_PARAMS' || edit === '%GIT_PARAMS%'
	const isHuskyParams =
		edit === '$HUSKY_GIT_PARAMS' || edit === '%HUSKY_GIT_PARAMS%'

	if (isGitParams || isHuskyParams) {
		console.warn(`Using environment variable syntax (${edit}) in -e |\
--edit is deprecated. Use '{-E|--env} HUSKY_GIT_PARAMS instead'`)

		if (isGitParams && 'GIT_PARAMS' in process.env) {
			return process.env.GIT_PARAMS
		}
		if ('HUSKY_GIT_PARAMS' in process.env) {
			return process.env.HUSKY_GIT_PARAMS
		}
		throw new Error(
			`Received ${edit} as value for -e | --edit, but GIT_PARAMS or HUSKY_GIT_PARAMS are not available globally.`,
		)
	}
	return edit
}

function getSeed(seed: any) {
	const e = Array.isArray(seed.extends) ? seed.extends : [seed.extends]
	const n = e.filter((i: any) => typeof i === 'string')
	return n.length > 0
		? { extends: n, parserPreset: seed.parserPreset }
		: { parserPreset: seed.parserPreset }
}

function selectParserOpts(parserPreset: any) {
	if (typeof parserPreset !== 'object') {
		return undefined
	}

	if (typeof parserPreset.parserOpts !== 'object') {
		return undefined
	}

	return parserPreset.parserOpts
}

function loadFormatter(config: any, flags: any) {
	const moduleName = flags.format || config.formatter || '@commitlint/format'
	const modulePath =
		resolveFrom.silent(__dirname, moduleName) ||
		resolveFrom.silent(flags.cwd, moduleName) ||
		resolveGlobal.silent(moduleName)

	if (modulePath) {
		const moduleInstance = require(modulePath)

		if (isFunction(moduleInstance.default)) {
			return moduleInstance.default
		}

		return moduleInstance
	}

	throw new Error(`Using format ${moduleName}, but cannot find the module.`)
}
