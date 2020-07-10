/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { resolve } from 'path'
import { Job, run } from '@essex/shellrunner'

const auditCiConfig = resolve(__dirname, '../../../config/.audit-ci.js')

const licenseConfig = resolve(
	__dirname,
	'../../../config/licenses-to-fail-config.js',
)

export interface AuditCommandOptions {
	verbose: boolean
}

export async function execute(options: AuditCommandOptions): Promise<number> {
	try {
		const { code } = await run(checkSecurityIssues, checkLicenses)
		return code
	} catch (err) {
		console.error('audit error', err)
		return 1
	}
}

// Audit CVEs
const checkSecurityIssues: Job = {
	exec: 'audit-ci',
	args: ['--config', auditCiConfig],
}
const checkLicenses: Job = {
	exec: 'license-to-fail',
	args: [licenseConfig],
}
