/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

const Test2: React.FC = memo(function Test2() {
	return <div>Test 2</div>
})
const descriptor = {
	title: 'Test Story 2',
	component: Test2,
}

export const Basic = (): JSX.Element => <Test2 />
export const Basic2 = (): JSX.Element => <Test2 />
export default descriptor
