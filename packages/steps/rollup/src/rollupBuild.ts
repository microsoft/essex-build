import { existsSync } from 'fs'
import { run } from '@essex/shellrunner'
import { resolveGulpTask } from '@essex/tasklogger'
import { join } from 'path'

const cwd = process.cwd()
const rollupConfigPath = join(cwd, 'rollup.config.js')

export function rollupBuild(cb: (err?: Error) => void) {
	if (!existsSync(rollupConfigPath)) {
		return cb()
	} else {
		run({
			exec: 'rollup',
			args: ['-c', rollupConfigPath],
		})
			.then(({ code }) => {
				if (code !== 0) {
					throw new Error('non-zero exit code')
				}
			})
			.then(...resolveGulpTask('rollup', cb))
	}
}
