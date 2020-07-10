/**
 * Executes a gulp task (from gulp.parallel or gulp.serial) and returns a promise
 * representing it's success
 * @param task
 */
export function execGulpTask(
	task: (cb: (err?: Error) => void) => void,
): Promise<void> {
	return new Promise((resolve, reject) => {
		task(err => {
			if (err) {
				reject(err)
			} else {
				resolve()
			}
		})
	})
}
