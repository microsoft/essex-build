/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import through2 from 'through2'
import { GulpyTask } from './types'
export const noopStep = (): any => through2.obj()
export const noopTask: GulpyTask = (cb: (err?: Error) => void): void => cb()
