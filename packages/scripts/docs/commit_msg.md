# > essex commit-msg

Performs commit message verification, usually as part of a husky `commit-msg` hook.

# Details & Customization

By default, we use `@commitlint/conventional`. This allows us to categorize and audit commits, which allows for more standardized changelog file generation.

To override this, define a `commitlint.config.js` file in your repository. To disable this check, remove the `commit-msg` hook in your husky settings.
