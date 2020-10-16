/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'

const Test: React.FC = memo(function Test() {
	return <div>Test 1</div>
})

const descriptor = {
	title: 'Test Story',
	component: Test,
}
export const Basic = (): JSX.Element => <Test />
export const Basic2 = (): JSX.Element => <Test />
export default descriptor
