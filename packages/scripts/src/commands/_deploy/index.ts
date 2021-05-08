/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { DeployCommandOptions } from './types'
import { success, fail, printPerf } from '@essex/tasklogger'
import { now, processStart } from '../../timers'
import { execute } from './tasks'

export default function deploy(program: Command): void {
	program
		.command('deploy')
		.description('deploys standard essex projects')
		.option('-v, --verbose', 'verbose output')
		.option('--storageAccount <storageAccount>', 'Azure Storage Account Id')
		.option(
			'--storageAccountKey <storageAccountKey>',
			'Azure Storage Account Key',
		)
		.option(
			'--type <type>',
			'deployment type: (e.g. azure-blob-storage)',
			'azure-blob-storage',
		)
		.action(
			(options: DeployCommandOptions): Promise<any> => {
				return Promise.resolve()
					.then(() => execute(options))
					.then(() => success(`deploy ${printPerf(processStart(), now())}`))
					.catch(err => {
						console.log('error in deploy', err)
						process.exitCode = 1
						fail(`deploy ${printPerf(processStart(), now())}`)
					})
			},
		)
}
