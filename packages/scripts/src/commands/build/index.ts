import { Command } from 'commander'
import { execute } from './execute'
import { BuildCommandOptions } from './types'

export default function build(program: Command): void {
	program
		.command('build')
		.description('builds a library package')
		.option('-v, --verbose', 'verbose output')
		.option('--docs', 'enables documentation generation')
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
		.action(async (options: BuildCommandOptions) => {
			const code = await execute(options)
			process.exit(code)
		})
}
