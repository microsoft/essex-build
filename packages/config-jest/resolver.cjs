/* eslint-disable */
const exts = ['.ts', '.tsx', '.cts', '.mts']

module.exports = (request, options) => {
	const defaultResolver =
		options.defaultResolver ||
		require('jest-resolve/build/defaultResolver').default
	try {
		return defaultResolver(request, options)
	} catch (_err) {
		for (const ext of exts) {
			try {
				return defaultResolver(request.replace(/\.js$/, ext), options)
			} catch (_err) {
				// do nothing
			}
		}
	}
}
