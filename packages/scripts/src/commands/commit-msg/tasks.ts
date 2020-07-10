import * as gulp from 'gulp'
import { checkCommitMessage } from '@essex/build-step-commitlint'

export function configureTasks() {
	return gulp.series(checkCommitMessage)
}
