/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const control = require('remark-message-control')

export function filter(options: { allow: string[] } = { allow: [] }): any {
	return control({
		name: 'docs',
		disable: options.allow,
		source: ['retext-equality', 'retext-profanities'],
	})
}
