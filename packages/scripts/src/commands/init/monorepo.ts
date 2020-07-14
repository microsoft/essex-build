/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as log from '@essex/tasklogger'
import { recipes } from '../recipes/recipes'
import { copyConfigFile } from './util'

const INIT_INSTRUCTIONS = `
To utilize the essex build system, you should define scripts in your package.json file that utilize the build system. Here are some examples:

${recipes}
`
const INIT_MSG_FAIL = `
Not all configuration has been copied to the target location, as it already exists. 
Check the logs for more details.

${INIT_INSTRUCTIONS}
`

const CONFIG_FILES = [
	'.huskyrc',
	'.prettierrc',
	'.prettierignore',
	'.eslintrc',
	'.eslintignore',
	'.docsrc',
	'.gitignore',
	'tsconfig.json',
]

export function initMonorepo(): Promise<number> {
	return Promise.all(CONFIG_FILES.map(copyConfigFile)).then(results => {
		const result = results.reduce((a, b) => a + b, 0)
		if (result > 0) {
			log.info(INIT_MSG_FAIL)
		} else {
			log.info(INIT_INSTRUCTIONS)
		}
		return result
	})
}
