/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export enum BuildMode {
	/**
	 * Legacy package structure: main, module, types
	 */
	legacy = 'legacy',

	/**
	 * Modern dual-mode CJS/ESM package (default CJS, include MJS)
	 */
	dual = 'dual',

	/**
	 * Modern ESM package (type: module)
	 */
	esm = 'esm',
}
