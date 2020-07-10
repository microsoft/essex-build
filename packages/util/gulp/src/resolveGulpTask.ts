import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'

/**
 * Returns promise .then(...) handlers to use a promise-based task with gulp
 * @param title The task title
 * @param cb The gulp callback
 */
export function resolveGulpTask(
	title: string,
	cb: (err?: Error) => void,
): [() => void, (err: Error) => void] {
	return [
		() => {
			subtaskSuccess(title)
			cb()
		},
		err => {
			subtaskFail(title)
			cb(err)
		},
	]
}
