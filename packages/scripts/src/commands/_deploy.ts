/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { deployBlob } from '../steps/azure'

interface DeployCommandOptions {
	verbose: boolean
	type: DeployType
	storageAccount: string
	storageAccountKey: string
	paths: string
}

enum DeployType {
	AzureBlobStorage = 'azure-blob-storage',
}

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
		.option(
			'--paths <paths>',
			'When using Azure-Blob-Storage deployment, the paths to upload into the blob container, comma-delimited.',
			'build/,public/,/dist',
		)
		.action(async (options: DeployCommandOptions): Promise<any> => {
			await execute(options)
		})
}

function execute(options: DeployCommandOptions): Promise<void> {
	if (!options.type) {
		throw new Error("'type' argument not set")
	}
	switch (options.type) {
		case DeployType.AzureBlobStorage: {
			return executeAzureBlobDeploy(options)
		}
		default:
			throw new Error(`Unhandled deploy type: ${options.type}`)
	}
}

function executeAzureBlobDeploy({
	storageAccount,
	storageAccountKey,
	verbose = false,
	paths,
}: DeployCommandOptions) {
	if (!storageAccount) {
		throw new Error('storageAccount must be set')
	}
	if (!storageAccountKey) {
		throw new Error('storageAccountKey must be set')
	}
	const pathsToPass = paths.split(',').map(p => p.trim())
	return deployBlob(storageAccount, storageAccountKey, verbose, pathsToPass)
}
