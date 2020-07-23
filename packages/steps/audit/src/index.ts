/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { resolve } from 'path'
import { gulpify, filterShellCode } from '@essex/build-utils'
import { run } from '@essex/shellrunner'
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'

const auditCiConfig = resolve(__dirname, '../config/audit-ci.js')
const licenseConfig = resolve(__dirname, '../config/licenses-to-fail-config.js')

export function auditSecurity(): Promise<void> {
	return run({
		exec: 'audit-ci',
		args: ['--config', auditCiConfig],
	})
		.then(filterShellCode)
		.then(
			() => subtaskSuccess('security'),
			() => subtaskFail('security'),
		)
}

export function auditLicenses(): Promise<void> {
	return run({
		exec: 'license-to-fail',
		args: [licenseConfig],
	})
		.then(filterShellCode)
		.then(
			() => subtaskSuccess('licenses'),
			() => subtaskFail('licenses'),
		)
}

export const auditSecurityGulp = gulpify('audit-security', auditSecurity)
export const auditLicensesGulp = gulpify('audit-licenses', auditLicenses)
