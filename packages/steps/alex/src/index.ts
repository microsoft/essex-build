const app = require('alex/app')

export async function alex() {
	const result = await app(['.'], {})
	console.log("ALEX", result)
	return result
}
// // Adapted from https://raw.githubusercontent.com/get-alex/alex/main/cli.js
// var engine = require('unified-engine')
// var unified = require('unified')
// var markdown = require('remark-parse')
// var frontmatter = require('remark-frontmatter')
// var english = require('retext-english')
// var remark2retext = require('remark-retext')
// var report = require('vfile-reporter')
// var equality = require('retext-equality')
// var profanities = require('retext-profanities')
// var diff = require('unified-diff')
// var pack = require('./package')
// var filter = require('./filter')

// // Set-up.
// const extensions = [
// 	'txt',
// 	'text',
// 	'md',
// 	'markdown',
// 	'mkd',
// 	'mkdn',
// 	'mkdown',
// 	'ron',
// ]

// export function runAlex(verbose?: boolean): Promise<void> {
//   console.log("A")
// 	const globs = ['{docs/**/,doc/**/,}*.{' + extensions.join(',') + '}']

// 	return new Promise((resolve, reject) => {
//     console.log("B")
// 		engine(
// 			{
// 				processor: unified(),
// 				files: globs,
// 				extensions: extensions,
// 				configTransform: transform,
// 				output: false,
// 				out: false,
// 				streamError: new PassThrough(),
// 				rcName: '.alexrc',
// 				packageField: 'alex',
// 				ignoreName: '.alexignore',
// 				frail: true,
// 				defaultConfig: transform(),
// 			},
// 			(err: any, code: any, result: any) => {
// 				const out = report(err || result.files, {
// 					verbose,
// 				})

// 				if (out) {
// 					reject(out)
// 				} else {
// 					resolve()
// 				}
// 			},
// 		)
// 	})
// }

// function transform(options?: any) {
// 	var settings = options || {}
// 	var plugins = [
// 		english,
// 		[profanities, { sureness: settings.profanitySureness }],
// 		[equality, { noBinary: settings.noBinary }],
// 	]

// 	plugins = [
// 		markdown,
// 		[frontmatter, ['yaml', 'toml']],
// 		[remark2retext, unified().use({ plugins: plugins })],
// 	]

// 	plugins.push([filter, { allow: settings.allow }])

// 	/* istanbul ignore if - hard to check. */
// 	if (diff) {
// 		plugins.push(diff)
// 	}

// 	return { plugins }
// }
