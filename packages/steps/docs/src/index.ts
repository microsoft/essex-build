/* eslint-disable @typescript-eslint/no-var-requires */
import  {filter} from './filter'
import personal from './personal'
import { PassThrough } from 'stream'
const engine = require('unified-engine')
const unified = require('unified')
const markdown = require('remark-parse')
const htmlParser = require('rehype-parse')
const frontmatter = require('remark-frontmatter')
const english = require('retext-english')
const remark2retext = require('remark-retext')
const rehype2retext = require('rehype-retext')
const report = require('vfile-reporter')
const equality = require('retext-equality')
const profanities = require('retext-profanities')
const spelling = require('retext-spell')
const englishDictionary = require('dictionary-en')
/**
 * Executes the 'alex' tool for tonal linting
 */
export async function docs() {
	const result = await app(['.'], {})
	if (result !== 0) {
		throw new Error('alex reported failures')
	}
}

var textExtensions = [
	'txt',
	'text',
	'md',
	'markdown',
	'mkd',
	'mkdn',
	'mkdown',
	'ron',
]
var htmlExtensions = ['htm', 'html']

interface AppArgs {
	html?: boolean
	text?: boolean
	diff?: boolean
	verbose?: boolean
	quiet?: boolean
}

/**
 * Executes the CLI Application
 */
function app(
	input: string[],
	{ html, text, diff, verbose, quiet }: AppArgs,
): Promise<number> {
	const extensions = html ? htmlExtensions : textExtensions
	const defaultGlobs = [
		'{README,readme,docs/**/,doc/**/,}*.{' + extensions.join(',') + '}',
	]
	let silentlyIgnore: boolean = false
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
				extensions: extensions,
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
				var out = report(err || result.files, {
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
		const retextPlugins = [
			english,
			[profanities, { sureness: settings.profanitySureness }],
			[equality, { noBinary: settings.noBinary }],
			[spelling, { dictionary: englishDictionary, ignore: settings.spelling, personal, max: 3 }],
		]

		let plugins: any[] = [...retextPlugins]
		if (html) {
			plugins = [
				htmlParser,
				[rehype2retext, unified().use({ plugins: retextPlugins })],
			]
		} else if (!text) {
			plugins = [
				markdown,
				[frontmatter, ['yaml', 'toml']],
				[remark2retext, unified().use({ plugins: retextPlugins })],
			]
		}

		plugins.push([filter, { allow: settings.allow }])

		/* istanbul ignore if - hard to check. */
		if (diff) {
			plugins.push(diff)
		}

		return { plugins }
	}
}
