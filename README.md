# Codiga CLI

This CLI tool is intended to make interacting with Codiga as smooth as possible.

## Getting Started

Ensure you have Node.js installed first. You can do that by running the following in your terminal.

> If you don't have it installed, go to [download Node.js](https://nodejs.org/en/download/) now.

```bash
node -v
```

Now you can install our CLI tool with either of the following.

```bash
# if you want to add it to your package.json
npm i --save-dev @codiga/cli

# if you want to install it globally
npm i -g @codiga/cli
```

Run the following command to see what's available directly in your terminal or keep reading for more.

```bash
codiga --help
```

## Commands

### Add a Codiga API token

Use the command below to set your Codiga API token. This token will be needed to run certain operations. You can [create a Codiga API token](https://app.codiga.io/api-tokens) on our app.

```bash
codiga token-add
```

### Check for a Codiga API token

Use the command below to check if you have a **valid** Codiga API token set. You can [create a new Codiga API token](https://app.codiga.io/api-tokens) on our app.

```bash
codiga token-check
```

### Delete a Codiga API token

Use the command below to delete a Codiga API token _from your system_. You can [manage your Codiga API tokens](https://app.codiga.io/api-tokens) on our app.

```bash
codiga token-delete
```

### Create or add rulesets to a `codiga.yml`

To create a `codiga.yml` file with rulesets or to quickly add new rulesets to a `codiga.yml` file, we offer a single command.

If you run the command below, we'll open an interactive menu where we can suggest languages and rulesets, and you can choose which ones to use.

```bash
codiga ruleset-add
```

If you know what rulesets you want to add, you can pass their names into the command like you see below.

```bash
codiga ruleset-add my-public-ruleset my-private-ruleset
```

### Analyze and report issues for a file or directory

#### Single File

To analyze a single file named `file.js` you can could run the following commands. The first command would analyze `file.js` for violations with the rules found in `foo-ruleset` and the second command would include the rules from `bar-ruleset` too.

```bash
codiga analyze file.js --ruleset foo-ruleset
```

```bash
codiga analyze file.js --ruleset foo-ruleset --ruleset bar-ruleset
```

> When analyzing a single file, a valid ruleset must be set using the `--ruleset` option.

#### Directory

To analyze a directory and all the files within, you could run any of the following commands to target the directory `foo`.

```bash
codiga analyze foo
```

```bash
codiga analyze ./foo
```

```bash
codiga analyze /Users/cool-name/foo
```

When analyzing a directory it isn't necessary to specify a ruleset using `--ruleset`, **if** you have a `codiga.yml` file in the targeted directory. If there isn't a `codiga.yml` and you haven't specified rulesets in the command, the analyze will exit.

> You can find rulesets to use on the [Codiga Hub](https://app.codiga.io/hub/rulesets) or you can use a command introduced above `codiga ruleset-add` to create a `codiga.yml` quickly.

#### Options

- `-r/--ruleset`
  - Specify the rulesets you want your analysis done with
    - **Required:** when analyzing a single file or when there isn't a `codiga.yml` in the root targeted directory
    - **Default:** `codiga.yml`
    - **Notes:** if set, will override a `codiga.yml`
- `-f/--format`
  - Specify the format you want your analysis reported in
    - **Options:** `text`, `json`, `csv`
    - **Default:** `text`
- `-o/--output`
  - Specify where you want your analysis reported to
    - **Default:** `stdout`
    - **Examples:** `results.csv`, `violations.json`, `analysis.text`
    - **Notes:** If there are no violations, no file will be created.
- `--follow-symlinks`
  - Specify if you want to follow and analyze symbolic links
    - **Default:** false

### Analysis and report issues between two commits

Use the command below to detect any violations between your two commits.

As the command name suggests, this works best in a `pre-push` git hook. Everytime a `git push` command is ran, that developer will know that their code doesn't have any violations and if they do, they will need to push new commits to rectify those violations before pushing again.

```bash
codiga git-push-hook --remote-sha 1234567 --local-sha 7654321
```

## Git Hook (pre-push)

### `.git`

To utilize the git `pre-push` hook automatically, you'll need to follow "Getting Started" above and then copy the following into a `.git/hooks/pre-push` file and then run `chmod a+x .git/hooks/pre-push` to make it executable.

```bash
#!/bin/sh

while read local_ref local_sha remote_ref remote_sha
do
  codiga git-push-hook --remote-sha $remote_sha --local-sha $local_sha
done

exit 0
```

### `.husky`

If you're already using a tool like [husky](https://github.com/typicode/husky) to handle git hooks the following would go into a `.husky/pre-push` file and then run `chmod +x .husky/pre-push` to make it executable.

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

while read local_ref local_sha remote_ref remote_sha
do
  codiga git-push-hook --remote-sha $remote_sha --local-sha $local_sha
done

exit 0
```

## Contributors

[Daniel Strong]()

## License

MIT
