# How to Release

Note: taken from [pnpm documentation](https://pnpm.js.org/en/using-changesets#releasing-changes)

- `pnpx changeset`
  This will create a new changeset document describing what changes were made to what workspaces. This should be done frequently.
- `pnpx changeset version`
  This will bump all the package versions in the monorepo and update the changelog files.
- `pnpm install`
  This will update the lockfile.
- `git commit`
  Commit Changes.
- `pnpm publish -r`
  This command will publish all packages that have bumped versions not yet present in the registry.
