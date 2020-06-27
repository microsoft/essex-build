import { streamToPromise } from "../utils/streamToPromise"
import * as gulp from 'gulp'
import * as ts from 'gulp-typescript'
import * as debug from 'gulp-debug'
import { noop } from './noop'
import { subtaskSuccess } from "../utils/log"

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

/**
 * Emits typings files into dist/typings
 * @param configFile The tsconfig.json path
 * @param verbose verbose mode
 */
export async function emitTypings(configFile: string, verbose: boolean): Promise<void> {
  return tsJob({
    configFile,
    verbose,
    dest: 'dist/typings',
    title: 'typings',
    overrides: {
      declaration: true,
      emitDeclarationOnly: true,
      stripInternal: true  
    }
  })
}

interface TsJobSpec {
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
function tsJob({configFile, verbose, dest, title, overrides}: TsJobSpec) {
  const tsProject = ts.createProject(configFile, overrides)
	const stream = gulp
		.src(['src/**/*.ts*', '!**/__tests__/**'])
		.pipe(tsProject())
		.pipe(verbose ? debug({ title }) : noop())
		.pipe(gulp.dest(dest))
  return streamToPromise(stream, title)
}