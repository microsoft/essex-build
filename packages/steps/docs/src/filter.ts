/* eslint-disable @typescript-eslint/no-var-requires */
const control = require('remark-message-control')

export function filter(options: { allow: string[] } = { allow: [] }) {
	return control({
		name: 'docs',
		disable: options.allow,
		source: ['retext-equality', 'retext-profanities'],
	})
}
