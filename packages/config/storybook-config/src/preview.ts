const { addDecorator } = require('@storybook/react')
const { withKnobs } = require('@storybook/addon-knobs')
const { withA11y } = require('@storybook/addon-a11y')
const { addParameters } = require('@storybook/react')
const { DocsPage, DocsContainer } = require('@storybook/addon-docs/blocks')

addDecorator(withKnobs)
addDecorator(withA11y)

addParameters({
	docs: {
		container: DocsContainer,
		page: DocsPage,
	},
})
