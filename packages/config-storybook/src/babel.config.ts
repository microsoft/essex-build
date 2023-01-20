/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
module.exports = {
	presets: [
		[require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
		[
			require.resolve('@babel/preset-env'),
			{
				targets: {
					esmodules: true,
				},
			},
		],
		[require.resolve('@babel/preset-typescript'), {}],
	],
}
