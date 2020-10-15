/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as gulp from 'gulp'
import { auditSecurity, auditLicenses } from '@essex/build-step-audit'

export function configureTasks(): gulp.TaskFunction {
	return gulp.parallel(auditSecurity, auditLicenses)
}
