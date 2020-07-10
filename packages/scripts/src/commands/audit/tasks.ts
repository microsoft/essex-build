import * as gulp from 'gulp'
import { auditSecurity, auditLicenses } from '@essex/build-step-audit'

export function configureTasks() {
  return gulp.parallel(auditSecurity, auditLicenses)
}