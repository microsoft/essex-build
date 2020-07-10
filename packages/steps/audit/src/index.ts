/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { resolve } from 'path'
import { resolveGulpTask, filterShellCode } from '@essex/build-utils-gulp'
import { run } from '@essex/shellrunner'

const auditCiConfig = resolve(__dirname, '../config/.audit-ci.js')
const licenseConfig = resolve(
	__dirname,
	'../config/licenses-to-fail-config.js',
)

export function auditSecurity(cb: (err?: Error) => void) {
	run({
		exec: 'audit-ci',
		args: ['--config', auditCiConfig],
  })
  .then(filterShellCode)
  .then(...resolveGulpTask('audit-sec', cb))
}

export function auditLicenses(cb: (err?: Error) => void) {
	run({
		exec: 'license-to-fail',
		args: [licenseConfig],
  })
  .then(filterShellCode)
  .then(...resolveGulpTask('audit-licenses', cb))
}
