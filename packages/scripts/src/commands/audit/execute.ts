/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RunArg, runSequential } from '../../utils'
import { resolve } from 'path'

const licenseConfig = resolve(
	__dirname,
	'../../../config/licenses-to-fail-config.js',
)

export interface AuditCommandOptions {
	verbose: boolean
}

export async function execute(options: AuditCommandOptions): Promise<number> {
	const runs: Array<RunArg | RunArg[]> = []
	runs.push([
		// Audit CVEs
		{ exec: 'audit-ci', args: ['-h'] },

		// Check Licenses
		{ exec: 'license-to-fail', args: [licenseConfig] },
	])
	return runSequential(runs)
}
