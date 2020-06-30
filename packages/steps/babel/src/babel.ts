/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import * as gulp from 'gulp'
import * as babel from 'gulp-babel'
import * as debug from 'gulp-debug'
import { noop } from '@essex/build-util-noop'
import { streamToPromise } from '@essex/build-util-stream-to-promise'
import { babelCjs as defaultCjs, babelEsm as defaultEsm } from './default-config'

const cjsOverridePath = join(process.cwd(), 'babelrc.cjs.js')
const cjsConfig = existsSync(cjsOverridePath) ? require(cjsOverridePath) : defaultCjs

const esmOverridePath = join(process.cwd(), 'babelrc.esm.js')
const esmConfig = existsSync(esmOverridePath) ? require(esmOverridePath) : defaultEsm

/**
 * Transpile ts output into babel cjs
 * @param verbose 
 */
export async function babelCjs(verbose: boolean): Promise<void>  {
  const title = 'babel-cjs'
  const stream = gulp.src(['lib/**/*.js*'])
  .pipe(babel(cjsConfig))
  .pipe(verbose ? debug({ title }) : noop())
  .pipe(gulp.dest('dist/cjs'))
  await streamToPromise(stream)
}


/**
 * Transpile ts output into babel esm
 * @param verbose 
 */
export async function babelEsm(verbose: boolean): Promise<void>  {
  const title = 'babel-esm'
  const stream = gulp.src(['lib/**/*.js*'])
  .pipe(babel(esmConfig))
  .pipe(verbose ? debug({ title }) : noop())
  .pipe(gulp.dest('dist/esm'))
  return streamToPromise(stream)
}
