/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export const recipes = `
{
	"name": "monorepo-root",
	"private": true,
	"scripts": {
		/* orchestrate child packages */
		"clean": "lerna run clean --stream --parallel",    
		"build": "lerna run build --stream",
		"build:ci": "lerna run build --stream -- --docs",
		"bundle": "lerna run bundle --stream",

		/* use @essex/scripts for top-level checks */
    "lint": "essex lint",
    "lint:ci": "essex lint --docs",
    "test": "essex test",
    "test:ci": "essex test --coverage",   

		/* hook for CI builds */
		"ci": "run-s lint:ci build:ci bundle test:ci"
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

{
	"name": "storybook-app",
	"private": true,
	"scripts": {
		"clean": "essex clean storybook-static",
		"start": "essex start-storybook",
		"bundle": "essex build-storybook"
	}
}
`
