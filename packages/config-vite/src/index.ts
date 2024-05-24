/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import react from '@vitejs/plugin-react'
import type { UserConfigExport } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: UserConfigExport = {
	build: {
		target: 'es2021',
	},
	plugins: [react(), tsconfigPaths()],
}

// biome-ignore lint/style/noDefaultExport: vite config
export default config
