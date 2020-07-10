/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { checkCommitMessage } from '@essex/build-step-commitlint'
import * as gulp from 'gulp'

export function configureTasks() {
	return gulp.series(checkCommitMessage)
}
