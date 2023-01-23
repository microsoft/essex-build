const { configure } = require('@essex/storybook-config/main')
const path = require('path')

module.exports = configure({
	stories: [path.join(__dirname, '../src/*.stories.tsx')],
})
