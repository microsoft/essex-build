/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import './index.css'

import { a } from '@essex/test-lib-dual'
import { b } from '@essex/test-lib-esm'
import { c } from '@essex/test-lib-legacy'
import docs from '@essex/test-lib-md-index'
import { memo } from 'react'

import { state } from '~state'

const docsContent = Object.keys(docs)
	.map((key) => docs[key])
	.join('\n\n')

export const App: React.FC = memo(function App() {
	return (
		<div>
			<h2>webpack tester</h2>
			<div>Dual: {a === 'a' ? '✅' : '❌'}</div>
			<div>ESM:{b === 'b' ? '✅' : '❌'}</div>
			<div>Legacy: {c === 'c' ? '✅' : '❌'}</div>
			<div>{JSON.stringify(state)}</div>
			<div>{docsContent}</div>
		</div>
	)
})
