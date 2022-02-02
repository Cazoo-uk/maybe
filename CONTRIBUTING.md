## Tests

This project uses TS-Jest for testing. Tests are written in jest, and can be run with `npm test`.

## Linting
This project uses [Cazoo's ESLint config](https://github.com/Cazoo-uk/cazoo-eslint) for linting. Builds will fail if there are unresolved issues. Use `npm run fix` to autofix.


## Releasing a new version

This repository uses a tag-based workflow to release new versions.

To submit a change, open a new pull request. The pull request will build and run all unit tests.

When the pull request is merged into main, the project will push a new pre-release version. 

To release the change, create a new tagged commit using the `npm version` command. Eg. `npm version patch`.

### Example

Your project is at version 1.0.0. You open a pull request and merge the PR to the main branch.

The build runs and pushes a pre-release version `1.0.1.dev-abc123` where abc123 is the git short hash for the latest commit.

You test the prerelease by installing it from npm eg. `npm install @cazoo/my-project@1.0.1.dev-abc123`.

Once you're happy that the pre-release works, you release a stable version by pushing a new version tag, eg. `npm version minor`. This updates package.json to the next minor version - 1.1.0

The build runs, and pushes stable version `1.1.0`. The next commit to main will push a prerelease `1.1.1.dev-abc123`, and so on.
