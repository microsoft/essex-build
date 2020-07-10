import { run } from '@essex/shellrunner'
import { resolveGulpTask, filterShellCode } from '@essex/build-utils-gulp'
import { join } from 'path'
import { existsSync } from 'fs'

const cwd = process.cwd()
const defaultConfig = join(__dirname, '../config/commitlint.config.js')
const overrideConfig = join(cwd, 'commitlint.config.js')
const configFile = existsSync(overrideConfig) ? overrideConfig : defaultConfig

export function checkCommitMessage(cb: (err?: Error) => void) {
	run({
		exec: 'commitlint',
		args: ['--config', configFile, '-E', 'HUSKY_GIT_PARAMS'],
	})
		.then(filterShellCode)
		.then(...resolveGulpTask('rollup', cb))
}
