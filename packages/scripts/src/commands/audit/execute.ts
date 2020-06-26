/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RunArg, runSequential } from '@essex/shellrunner'
import { resolve } from 'path'

const auditCiConfig = resolve(__dirname, '../../../config/.audit-ci.js')

const licenseConfig = resolve(
	__dirname,
	'../../../config/licenses-to-fail-config.js',
)

export interface AuditCommandOptions {
	verbose: boolean
}

export async function execute(options: AuditCommandOptions): Promise<number> {
	return runSequential(
		// Audit CVEs
		{ exec: 'audit-ci', args: ['--config', auditCiConfig] },

		// Check Licenses
		{ exec: 'license-to-fail', args: [licenseConfig] },
	)
}
