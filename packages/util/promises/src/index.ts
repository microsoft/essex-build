import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'

export function resolveTask(name: string): [() => void, (err: Error) => void] {
	return [
		() => subtaskSuccess(name),
		(err: Error) => {
			subtaskFail(name)
			throw err
		},
	]
}
