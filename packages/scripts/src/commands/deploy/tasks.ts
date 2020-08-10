/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { deployBlob } from '@essex/build-step-azure'
import { DeployCommandOptions, DeployType } from './types'

export function execute(options: DeployCommandOptions): Promise<void> {
	switch (options.type) {
		case DeployType.AzureBlobStorage: {
			return executeAzureBlobDeploy(options)
		}
	}
}

function executeAzureBlobDeploy(options: DeployCommandOptions) {
	return deployBlob(
		options.storageAccount,
		options.storageAccountKey,
		options.verbose,
	)
}
