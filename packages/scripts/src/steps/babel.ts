import { babelCjs as cjs, babelEsm as esm } from '../config/babel-config'
import * as gulp from 'gulp'
import * as babel from 'gulp-babel'
import * as debug from 'gulp-debug'
import { noop } from './noop'
import { streamToPromise } from '../utils/streamToPromise'

/**
 * Transpile ts output into babel esm
 * @param verbose 
 */
export async function babelEsm(verbose: boolean): Promise<void>  {
  const title = 'babel-esm'
  const stream = gulp.src(['lib/**/*.js*'])
  .pipe(babel(esm))
  .pipe(verbose ? debug({ title }) : noop())
  .pipe(gulp.dest('dist/esm'))
  return streamToPromise(stream, title)
  
}

/**
 * Transpile ts output into babel cjs
 * @param verbose 
 */
export async function babelCjs(verbose: boolean): Promise<void>  {
  const title = 'babel-cjs'
  const stream = gulp.src(['lib/**/*.js*'])
  .pipe(babel(cjs))
  .pipe(verbose ? debug({ title }) : noop())
  .pipe(gulp.dest('dist/cjs'))
  await streamToPromise(stream, title)
}
