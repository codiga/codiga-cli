# Error Codes

Get more information below regarding a specific error code you received.

## E001

Either you ran an empty `codiga` command or you provide an incorrect action.

```bash
# Bad
codiga
codiga token-chk
codiga token-dlte

# Good
codiga --help
codiga token-check
codiga token-delete
```

## E002

More than one action was passed. You need to split your commands into multiple invocations.

```bash
# Bad
codiga token-check token-add
codiga token-add token-delete

# Good
codiga token-check
codiga token-add
codiga token-delete
```

## E003

We were unable to execute a git command. Please ensure you run your command within a git directory.

```bash
# BAD - if there's no git repository to execute against
codiga git-push-hook

# GOOD - if there's is a git repository
codiga git-push-hook
```

## E004

We were unable to read from a file.

Please review the file that this error outputed and ensure it exists. If you believe there's an error on our side, please [contact support](https://app.codiga.io/support).

## E005

We were unable to parse a YAML file.

Please review the file that this error outputed and ensure it's valid YAML structure. If you believe there's an error on our side, please [contact support](https://app.codiga.io/support).

## E006

We found a `codiga.yml` file, but there isn't a `rulesets` list available. Ensure you follow the correct structure below.

```yaml
# GOOD - codiga.yml
rulesets:
  - <ruleset-one-name>
  - <ruleset-two-name>
  - <ruleset-three-name>
```

```yaml
# BAD - codiga.yml
- <ruleset-one-name>
- <ruleset-two-name>
- <ruleset-three-name>
```

## E007

We found a `codiga.yml` file, but there weren't any rulesets listed in it.

```yaml
# GOOD - codiga.yml
rulesets:
  - <ruleset-one-name>
  - <ruleset-two-name>
  - <ruleset-three-name>
```

```yaml
# BAD - codiga.yml
# one empty item
rulesets:
  -
# no items
rulesets:
```

## E008

There was a Codiga API error while we were fetching your rulesets for an analysis.

First, we suggest you ensure that you have a valid Codiga API token set with the following command:

```bash
codiga token-check
```

Secondly, we suggest running the command again as this could be a simple network error. However, if the issue persists, please [contact support](https://app.codiga.io/support) and reference this error code to further assistance.
