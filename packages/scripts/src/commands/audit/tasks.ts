/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { auditSecurity, auditLicenses } from '@essex/build-step-audit'
import * as gulp from 'gulp'

export function configureTasks() {
  return gulp.parallel(auditSecurity, auditLicenses)
}