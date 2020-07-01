import { log } from './log'
const { join } = require('path')
const { existsSync } = require('fs')

export const pkgJson = require(join(process.cwd(), 'package.json'))

/**
 * Gets the static assets configuration for webpack dev server.
 * If <package>/assets directory is present, it will be used
 * to serve static assets out of.
 */
export function getWdsStaticConfig() {
	const staticFolder = join(process.cwd(), 'public')
	return existsSync(staticFolder)
		? {
				contentBase: staticFolder,
				watchContentBase: true,
		  }
		: {}
}

export function getHomePage() {
	return pkgJson.homepage ? pkgJson.homepage : false
}

export function getTitle() {
	return pkgJson.title || pkgJson.name || 'Essex Application'
}

export function getIndexFile() {
	const indexTsx = join(process.cwd(), 'src', 'index.tsx')
	const indexTs = join(process.cwd(), 'src', 'index.ts')
	const indexJsx = join(process.cwd(), 'src', 'index.jsx')
	const indexJs = join(process.cwd(), 'src', 'index.js')

	if (existsSync(indexTsx)) {
		log('entry: index.tsx')
		return indexTsx
	} else if (existsSync(indexTs)) {
		log('entry: index.ts')
		return indexTs
	} else if (existsSync(indexJsx)) {
		log('entry: index.jsx')
		return indexJsx
	} else {
		log('entry: index.js')
		return indexJs
	}
}

export function getBabelConfiguration() {
	const overrideFile = join(process.cwd(), 'babelrc.esm.js')
	const defaultFile = join(__dirname, 'babelrc.esm.js')

	if (existsSync(overrideFile)) {
		return require(overrideFile)
	} else {
		return require(defaultFile)
	}
}
