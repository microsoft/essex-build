/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { PassThrough } from 'stream'
import { filter } from './filter'
import personal from './personal'
const englishDictionary = require('dictionary-en')
const frontmatter = require('remark-frontmatter')
const markdown = require('remark-parse')
const remark2retext = require('remark-retext')
const english = require('retext-english')
const equality = require('retext-equality')
const profanities = require('retext-profanities')
const spelling = require('retext-spell')
const unified = require('unified')
const engine = require('unified-engine')
const report = require('vfile-reporter')

const textExtensions = [
	'txt',
	'text',
	'md',
	'markdown',
	'mkd',
	'mkdn',
	'mkdown',
	'ron',
]

export interface AppArgs {
	verbose?: boolean
	quiet?: boolean
}

/**
 * Executes the CLI Application
 */
export function app(
	input: string[],
	{ verbose, quiet }: AppArgs,
): Promise<number> {
	const extensions = textExtensions
	const defaultGlobs = [
		'{README,readme,docs/**/,doc/**/,}*.{' + extensions.join(',') + '}',
	]
	let silentlyIgnore = false
	let globs: string[]

	if (input.length === 0) {
		globs = defaultGlobs
		silentlyIgnore = true
	} else {
		globs = input
	}

	return new Promise(resolve => {
		engine(
			{
				processor: unified(),
				files: globs,
				extensions,
				configTransform: transform,
				output: false,
				out: false,
				streamError: new PassThrough(),
				rcName: '.docsrc',
				packageField: 'docs',
				ignoreName: '.docsignore',
				silentlyIgnore: silentlyIgnore,
				frail: true,
				defaultConfig: transform(),
			},
			function (err: Error, code: number, result: { files: string[] }) {
				const out = report(err || result.files, {
					verbose: verbose,
					quiet,
				})

				if (out) {
					console.error(out)
				}

				resolve(code)
			},
		)
	})

	function transform(settings: any = {}) {
		const plugins: any[] = [
			markdown,
			[frontmatter, ['yaml', 'toml']],
			[
				remark2retext,
				unified().use({
					plugins: [
						english,
						[profanities, { sureness: settings.profanitySureness }],
						[equality, { noBinary: settings.noBinary }],
						[
							spelling,
							{
								dictionary: englishDictionary,
								ignore: settings.spelling,
								personal,
								max: 3,
							},
						],
					],
				}),
			],
			[filter, { allow: settings.allow }],
		]

		return { plugins }
	}
}
