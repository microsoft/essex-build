import * as gulp from 'gulp'
const gulpEslint = require('gulp-eslint')
import { existsSync } from 'fs'
import { join } from 'path'

const releaseConfig = join(__dirname, '../../config/.eslintrc-release')
const experimentConfig = join(__dirname, '../../config/.eslintrc-experiment')
const projectConfig = join(process.cwd(), '.eslintrc')

export async function eslint(fix: boolean, strict: boolean): Promise<void> {
  let configFile = experimentConfig
  if (existsSync(projectConfig)) {
    configFile = projectConfig
  } else if (strict) {
    configFile = releaseConfig
  }
  gulp.src([
      '**/*.js', 
      '**/*.jsx', 
      '**/*.ts', 
      '**/*.tsx',
       '!**/node_modules/**', 
       '!**/lib/**', 
       '!**/dist/**', 
       '!**/build/**',
       '!**/storybook-static/**'
      ]).pipe(gulpEslint({configFile, fix}))
}