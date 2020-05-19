# > essex build-storybook

Builds a storybook-based package. Stories should be defined in `src/`. Our configuration loads the following story files:

- `src/index.ts`
- `src/**/<storyname>.(stories|story).(ts|tsx|js|jsx|mdx)`

# CLI Options

- `--verbose`<br/> enables verbose mode

# Details & Customization

By default, `@essex/scripts` will use an internal prescribed storybook configuration. The following storybook add-ons are installed by default:

- @storybook/addon-actions
- @storybook/addon-links
- @storybook/addon-knobs
- @storybook/addon-a11y
- @storybook/addon-docs

To use a custom configuration, you must define a `.storybook` directory in your package and configure storybook according to their documentation.
