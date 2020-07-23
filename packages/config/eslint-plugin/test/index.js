/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const fs = require('fs')
const path = require('path')

// https://stackoverflow.com/a/10915442
function load(dir) {
	fs.lstat(dir, function (err1) {
		if (!err1) {
			// we have a directory: do a tree walk
			fs.readdir(dir, function (err, files) {
				if (!err) {
					let f
					const l = files.length
					for (let i = 0; i < l; i++) {
						f = path.join(dir, files[i])
						require(f)
					}
				}
			})
		}
	})
}

// Run all js files in this directory
load(path.join(__dirname, 'rules'))
