/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TaskFunction } from 'undertaker'
import { noopTask } from './noop'

export function condition(task: TaskFunction, condition: boolean) {
	return condition ? noopTask : task
}
