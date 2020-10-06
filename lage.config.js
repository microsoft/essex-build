/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
module.exports = {
	cacheConfig: {
		// Ignores these minimatch patterns when considers what packages have changed for the --since flag
		ignore: ['README.md'],

		// All of these options are sent to `backfill`: https://github.com/microsoft/backfill/blob/master/README.md
		cacheOptions: {
			// These are the subset of files in the package directories that will be saved into the cache
			outputGlob: [
				'dist/**/*',
				'lib/**/*',
				'coverage/**/*',
				'!node_modules',
				'!docs/**/*.md',
			],
		},

		// These are relative to the git root, and affects the hash of the cache
		// Any of these file changes will invalidate cache
		environmentGlob: ['*.js', '*.json', '*.yml'],
	},
	pipeline: {
		clean: [],
		build: ['^build'],
		bundle: ['build'],
		test: ['build'],
		lint: [],
	},
	npmClient: 'yarn',
}
