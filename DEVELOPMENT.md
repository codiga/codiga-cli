# Development

### Getting Started

- Install the dependencies

  ```bash
  npm i
  ```

- Create a symlink

  ```bash
  npm link
  ```

- You're all set now, open help to see a list of commands

  ```bash
  codiga --help
  ```

### Running the tests

- Install and symlink the package as described in the Getting Started

  ```bash
  npm i
  npm link
  ```

- Run the test script

  ```bash
  npm run test
  ```

> We'll automatically run the tests on `push` and `merge-request` actions. You can see past workflow runs [here](https://github.com/codiga/codiga-cli/actions/workflows/main.yml).

### Release a new version

- Open a MR with your new changes
  - Bump the version in `package.json` and `package-lock.json` and commit it as well
- Once that's merged, go to [releases](https://github.com/codiga/codiga-cli/releases) and draft a new release
  - Choose a tag > Create a new tag > `vX.X.X` (should match your new version above)
  - Generate release notes
  - Publish release
- Verify the following:
  - The [Release Github Action](https://github.com/codiga/codiga-cli/actions/workflows/release.yml) is successful
  - The [NPM package](https://www.npmjs.com/package/@codiga/cli) was updated

### Notes

- If you're using `nvm` to change between node versions, you'll need to repeat the above for each version as the symlink step only links with the current node version.
