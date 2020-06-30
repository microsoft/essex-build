/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { clean } from '@essex/build-step-clean'
export async function execute(files: string[]): Promise<number> {
	return clean(files).then(() => 0, () => 1)
}

