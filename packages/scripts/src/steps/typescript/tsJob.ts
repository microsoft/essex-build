/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as gulp from 'gulp'
import * as ts from 'gulp-typescript'
import * as debug from 'gulp-debug'
import { streamToPromise } from "@essex/build-util-stream-to-promise"
import { noop } from '@essex/build-util-noop'
import { subtaskSuccess, subtaskFail } from '../../utils/log'

export interface TsJobSpec {
  /**
   * The job title for logging
   */
  title: string

  /**
   * Path to the tsconfig.json file to use
   */
  configFile: string

  /**
   * Whether to use verbose logging
   */
  verbose?: boolean

  /**
   * The output destination
   */
  dest: string

  /**
   * Compiler settings overrides
   */
  overrides?: ts.Settings | undefined
} 

/**
 * Base TypeScript job
 */
export function tsJob({configFile, verbose, dest, title, overrides}: TsJobSpec): Promise<void> {
  const tsProject = ts.createProject(configFile, overrides)
	const stream = gulp
		.src(['src/**/*.ts*', '!**/__tests__/**'])
		.pipe(tsProject())
		.pipe(verbose ? debug({ title }) : noop())
		.pipe(gulp.dest(dest))
  return streamToPromise(stream).then(() => subtaskSuccess(title), () => subtaskFail(title))
}