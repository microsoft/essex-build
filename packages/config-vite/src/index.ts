/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import reactRefresh from '@vitejs/plugin-react-refresh'
import type { UserConfigExport } from 'vite'
import reactJsx from 'vite-react-jsx'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: UserConfigExport = {
	build: {
		target: 'es2020',
	},
	plugins: [reactRefresh(), tsconfigPaths(), reactJsx()],
}
export default config
