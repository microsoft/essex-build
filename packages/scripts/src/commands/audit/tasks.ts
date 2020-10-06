/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { auditSecurity, auditLicenses } from '@essex/build-step-audit'
import { parallel, TaskFunction } from 'just-scripts'

export function configureTasks(): TaskFunction {
	return parallel(auditSecurity, auditLicenses)
}
