import { subtaskSuccess, subtaskFail } from "./log"

export function gulpReport(
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
