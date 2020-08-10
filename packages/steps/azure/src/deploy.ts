/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { promises as fs } from 'fs'
import * as path from 'path'
import {
	BlobServiceClient,
	StorageSharedKeyCredential,
	ContainerClient,
} from '@azure/storage-blob'
import * as glob from 'glob'
import * as mime from 'mime-types'

// files to upload. Directory is not recreated in Azure storage.
const DEFAULT_DIRECTORIES = ['build/', 'public/']

interface FileLocation {
	basePath: string
	file: string
}

function getBlobContainerClient(account: string, accountKey: string) {
	const sharedKeyCredential = new StorageSharedKeyCredential(
		account,
		accountKey,
	)
	const blobServiceClient = new BlobServiceClient(
		`https://${account}.blob.core.windows.net`,
		sharedKeyCredential,
	)

	return blobServiceClient.getContainerClient('$web')
}

function getFiles(basePath: string): FileLocation[] {
	return glob
		.sync(`${basePath}**`, { nodir: true })
		.map(f => ({ basePath, file: f.substring(basePath.length) }))
		.filter(f => f.file)
}

async function uploadFile(
	containerClient: ContainerClient,
	fileObj: FileLocation,
): Promise<void> {
	const content = await fs.readFile(path.join(fileObj.basePath, fileObj.file), {
		encoding: 'utf-8',
	})
	const options = {
		blobHTTPHeaders: {
			blobContentType: mime.lookup(fileObj.file) || 'application/octet-stream',
		},
	}
	const blobClient = containerClient.getBlockBlobClient(fileObj.file)
	const uploadBlobResponse = await blobClient.upload(
		content,
		Buffer.byteLength(content),
		options,
	)
	console.log(
		`Upload ${fileObj.file} successfully`,
		uploadBlobResponse.requestId,
	)
}

export async function deployBlob(
	storageAccount: string,
	storageAccountKey: string,
	verbose = false,
	directories = DEFAULT_DIRECTORIES,
): Promise<void> {
	const containerClient = getBlobContainerClient(
		storageAccount,
		storageAccountKey,
	)
	const files: FileLocation[] = []
	directories.forEach(dir => files.push(...getFiles(dir)))

	for (const fileObj of files) {
		if (verbose) {
			console.log('uploading ', fileObj.file)
		}
		await uploadFile(containerClient, fileObj)
	}
	if (verbose) {
		console.log('uploading complete')
	}
}
