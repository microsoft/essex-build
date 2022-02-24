#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Node 14 shim
 * String.prototype.replaceAll() polyfill
 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!String.prototype.replaceAll) {
	;(String as any).prototype.replaceAll = function (
		str: string | RegExp,
		newStr: string,
	) {
		// If a regex pattern
		if (
			Object.prototype.toString.call(str).toLowerCase() === '[object regexp]'
		) {
			return this.replace(str, newStr)
		}

		// If a string
		return this.replace(new RegExp(str, 'g'), newStr)
	}
}

import './entry.mjs'
