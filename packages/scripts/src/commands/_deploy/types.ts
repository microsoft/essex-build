/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface DeployCommandOptions {
	verbose: boolean
	type: DeployType
	storageAccount: string
	storageAccountKey: string
}

export enum DeployType {
	AzureBlobStorage = 'azure-blob-storage',
}
