/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { tsJob } from "./tsJob"

/**
 * Compiles typescript from src/ to the lib/ folder
 * @param configFile The tsconfig.json path
 * @param verbose verbose mode
 */
export async function compileTypescript(configFile: string, verbose: boolean): Promise<void> {
  return tsJob({
    configFile,
    verbose,
    dest: 'lib',
    title: 'tsc'
  })
}

