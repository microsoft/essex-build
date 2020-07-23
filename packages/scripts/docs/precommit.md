# > essex pre-commit

Performs precommit verification, usually as part of a husky `commit-msg` hook.

# Details & Customization

This script uses `lint-staged` to invoke a series of scripts based on matching file types.

To customize this behavior, you may define a `.lintstagedrc` file in your repository or a 'lint-staged' property in your top-level package.json to define what pre-commit actions are performed.

Our default configuration file invokes `pretty-quick --staged` on all files and `eslint --fix` on TypeScript and JavaScript source.
