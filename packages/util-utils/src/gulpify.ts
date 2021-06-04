import { GulpyTask } from './types'

export function gulpify(
	task: (...args: any[]) => Promise<void>,
): (...args: any) => GulpyTask {
	return (...args: any[]) =>
		() =>
			task(...args)
}
