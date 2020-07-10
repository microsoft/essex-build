/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { noopStep } from '@essex/build-utils-gulp'
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'
import * as gulp from 'gulp'
import * as debug from 'gulp-debug'
import * as ts from 'gulp-typescript'

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
	debug?: boolean

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
export function tsJob({
	configFile,
	debug: verbose,
	dest,
	title,
	overrides,
}: TsJobSpec): () => NodeJS.ReadWriteStream {
	return () => {
		const tsProject = ts.createProject(configFile, overrides)
		return gulp
			.src(['src/**/*.ts*', '!**/__tests__/**'])
			.pipe(tsProject())
			.pipe(verbose ? debug({ title }) : noopStep())
			.pipe(gulp.dest(dest))
			.on('end', () => subtaskSuccess(title))
			.on('error', () => subtaskFail(title))
	}
}
