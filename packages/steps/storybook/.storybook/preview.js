import { addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { withA11y } from '@storybook/addon-a11y'
import { addParameters } from '@storybook/react'
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks'

addDecorator(withKnobs)
addDecorator(withA11y)

addParameters({
	docs: {
		container: DocsContainer,
		page: DocsPage,
	},
})
