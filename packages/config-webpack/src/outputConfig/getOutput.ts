import { join } from 'path'

export function getOutput(extend: any): any {
	const buildPath = join(process.cwd(), 'build/')
	return {
		path: buildPath,
		chunkFilename: '[name].[chunkhash].js',
		filename: '[name].[fullhash].js',
		...extend
	}
}
