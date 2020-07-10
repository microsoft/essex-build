import { resolve } from 'path'
import { run } from '@essex/shellrunner'
import { resolveGulpTask } from '@essex/tasklogger'

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
  .then(({code}) => {
    if (code !== 0) {
      throw new Error('non-zero exit code')
    }
  })
  .then(...resolveGulpTask('audit-sec', cb))
}

export function auditLicenses(cb: (err?: Error) => void) {
	run({
		exec: 'license-to-fail',
		args: [licenseConfig],
  })
  .then(({code}) => {
    if (code !== 0) {
      throw new Error('non-zero exit code')
    }
  })
  .then(...resolveGulpTask('audit-licenses', cb))
}
