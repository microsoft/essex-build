/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const Component = () => <div>A story lives here</div>

const meta = {
	title: '@essex:components/Tree',
	component: Component,
}
// biome-ignore lint/style/noDefaultExport: this is a story
export default meta

export const Basic = () => <Component />
