/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { info } from '@essex/tasklogger'

export const recipes = `
{
	"name": "monorepo-root",
	"private": true,
	"scripts": {
		/* orchestrate child packages */
		"clean:all": "yarn workspaces foreach -piv run clean",    
		"build:all": "yarn workspaces foreach -pivt run build",		
		"bundle:all": "yarn workspaces foreach -piv run bundle",

		/* use @essex/scripts for top-level checks */
    "lint:all": "essex lint",    
    "unit:test": "essex test --coverage",

		/* hook for CI builds */
		"ci": "run-s lint:all build:all bundle:all unit:test"
	}
}

{
	"name": "library-package",
	"version": "1.0",
	"main": "dist/cjs/index.js",
	"module": "dist/esm/index.js",
	"types": "dist/types/index.d.ts",
	"scripts": {
		"build": "essex build",
		"clean": "essex clean",
		"start": "essex watch"
	}
}

{
	"name": "webpack-app",
	"private": true,
	"scripts": {
		"bundle": "essex bundle",
		"clean": "essex clean build",
		"start": "essex serve"
	}
}
`

export function printRecipes(): void {
	info(recipes)
}
