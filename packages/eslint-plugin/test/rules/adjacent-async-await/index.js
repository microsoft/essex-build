/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { join } = require('path')
const rule = require('../../../lib/rules/adjacent-await')
const RuleTester = require('eslint').RuleTester
const adaptTslintTestCase = require('../../utils/adaptTslintTestCase')
const { code, errors } = adaptTslintTestCase(join(__dirname, './test.es.lint'))
// const testCase = fs.readFileSync(__dirname + '/testCase.txt').toString()

RuleTester.setDefaultConfig({
	parserOptions: {
		parser: 'babel-eslint',
		ecmaVersion: 2018,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
})

const ruleTester = new RuleTester()
ruleTester.run('adjacent-await', rule, {
	valid: [
		{
			code: 'function test () {}',
		},
	],
	invalid: [
		{
			code,
			errors,
		},
	],
})
