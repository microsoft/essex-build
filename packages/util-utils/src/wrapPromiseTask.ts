import { printPerf, subtaskFail, subtaskSuccess } from '@essex/tasklogger'
import { performance } from 'perf_hooks'

export function wrapPromiseTask(
	title: string,
	swallowErrors: boolean,
	task: (...args: any[]) => Promise<void>,
): (...args: any[]) => Promise<void> {
	return async function execute(...args: any[]): Promise<void> {
		const start = performance.now()
		try {
			await task(...args)
			const end = performance.now()
			subtaskSuccess(`${title} ${printPerf(start, end)}`)
		} catch (err) {
			const end = performance.now()
			subtaskFail(`${title} ${printPerf(start, end)}`)
			if (!swallowErrors) {
				throw err
			}
		}
	}
}
