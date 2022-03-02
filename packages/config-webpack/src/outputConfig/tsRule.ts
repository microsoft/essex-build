import type { RuleSetRule } from 'webpack'
import { getSwcOptions } from '@essex/swc-opts'

/* eslint-disable @typescript-eslint/no-var-requires */
const swcLoader = require.resolve('swc-loader')

export const tsRule: RuleSetRule = {
	test: /\.tsx?$/,
	exclude: /node_modules/,
	use: { loader: swcLoader, options: getSwcOptions() },
}
