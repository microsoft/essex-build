/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import rimraf from 'rimraf'

export function rm(fileglob: string): Promise<void> {
	return rimraf(fileglob)
}
