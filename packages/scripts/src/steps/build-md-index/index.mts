/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import path from 'path'
import fs from 'fs/promises'
import { glob } from 'glob'

export async function buildMdIndex(include: string): Promise<void> {
	const indexImports: string[] = []
	async function processFile(filePath: string) {
		const content = await fs.readFile(filePath, { encoding: 'utf-8' })
		const localFilePath = filePath.replace(include, 'dist')
		const outputPathJs = localFilePath.replace('.md', '.js')
		const outputPathDts = localFilePath.replace('.md', '.d.ts')
		const outputDir = path.dirname(localFilePath)
		const indexFilePath = path.basename(localFilePath, '.md')

		indexImports.push(
			path
				.join(outputDir.replace('dist', ''), indexFilePath)
				.replace(/^\//, ''),
		)

		if (!existsSync(outputDir)) {
			await fs.mkdir(outputDir, { recursive: true })
		}

		await Promise.all([
			fs.writeFile(outputPathJs, jsContent(content), { encoding: 'utf-8' }),
			fs.writeFile(outputPathDts, dtsContent(content), { encoding: 'utf-8' }),
		])
	}

	const fileList = await getMarkdownFiles(include)
	const promises = fileList.map(processFile)
	await Promise.all(promises)
	await writeIndex(indexImports)
}

function getMarkdownFiles(include: string): Promise<string[]> {
	return glob(`${include}/**/*.md`)
}

function writeIndex(imports: string[]): Promise<void> {
	let importsArea = ''
	let mapArea = 'const index = {};\n'
	imports.forEach((imp) => {
		const impVar = imp.replace(/\//g, '_')
		const impKey = imp.replace(/\//g, '.')
		importsArea += `import { default as ${impVar} } from './${imp}.js'\n`
		mapArea += `index['${impKey}'] = ${impVar};\n`
	})

	const indexJsContent = `${importsArea}
${mapArea}
export default index;
`

	const indexDtsContent = `
declare const index: {[key: string]: string};
export default index;
`
	return Promise.all([
		fs.writeFile('dist/index.js', indexJsContent, { encoding: 'utf-8' }),
		fs.writeFile('dist/index.d.ts', indexDtsContent, { encoding: 'utf-8' }),
	]).then(() => {
		/* nothing*/
	})
}

function jsContent(content: string) {
	return `
const content = \`${escapeBackticks(content)}\`;
export default content;
`
}
function dtsContent(content: string) {
	return `
declare const content = \`${escapeBackticks(content)}\`;
export default content;
`
}

function escapeBackticks(content: string): string {
	return content.replaceAll('`', '\\`')
}
