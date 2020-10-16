/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export type GulpyCallback = (err?: Error) => void
export type GulpyTask = (cb: GulpyCallback) => void
