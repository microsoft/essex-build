import { subtaskSuccess, subtaskFail } from './log'

export function resolveTask(name: string): [() => void, (err: Error) => void] {
	return [
		() => subtaskSuccess(name),
		(err: Error) => {
			subtaskFail(name)
			throw err
		},
	]
}
