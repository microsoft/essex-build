import { Command } from 'commander'
import { BuildCommandOptions } from './types'
import { configureTasks } from './tasks'
import { execGulpTask, resolveShellCode } from '@essex/build-utils'

export default function build(program: Command): void {
	program
		.command('build')
		.description('builds a library package')
		.option('-v, --verbose', 'verbose output')
		.option(
			'-sb, --storybook',
			'builds storybook output in addition to normal build artifacts',
		)
		.option(
			'-wp, --webpack',
			'bundles webpack output using either the base config or webpack.config.js',
		)
		.option(
			'-rp, --rollup',
			'bundles rollup output using either the base config or rollup.config.js',
		)
		.option(
			'-c, --code',
			'transpiles TS; necessary when --webpack or --rollup is explicitly set',
		)
		.option('-d, --docs', 'generates TypeDoc documentation')
		.option(
			'--env <env>',
			'build environment (used by babel and webpack)',
			'production',
		)
		.option(
			'--mode <mode>',
			'enable production optimization or development hints ("development" | "production" | "none")',
			'production',
		)
		.action((options: BuildCommandOptions) => {
			Promise.resolve()
				.then(() => configureTasks(options))
				.then(build => execGulpTask(build))
				.then(...resolveShellCode())
				.then(code => process.exit(code))
		})
}
