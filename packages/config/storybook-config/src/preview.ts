/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const { withA11y } = require('@storybook/addon-a11y')
const { DocsPage, DocsContainer } = require('@storybook/addon-docs/blocks')
const { withKnobs } = require('@storybook/addon-knobs')
const { addDecorator } = require('@storybook/react')
const { addParameters } = require('@storybook/react')

addDecorator(withKnobs)
addDecorator(withA11y)

addParameters({
	docs: {
		container: DocsContainer,
		page: DocsPage,
	},
})
