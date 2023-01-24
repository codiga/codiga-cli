import yargs from "yargs";
import {
  ACTION_GIT_PUSH_HOOK,
  ACTION_TOKEN_ADD,
  ACTION_TOKEN_CHECK,
  ACTION_TOKEN_DELETE,
  ACTION_RULESET_ADD,
  OPTION_LOCAL_SHA,
  OPTION_REMOTE_SHA,
} from "../utils/constants";
import {
  printCommandSuggestion,
  printEmptyLine,
  printFailure,
} from "../utils/print";
import { checkPush } from "./checkPush";
import {
  addCodigaToken,
  checkCodigaToken,
  deleteCodigaToken,
} from "./codigaToken";
import { addRuleset } from "./addRuleset";

/**
 * Parses the given command into a readable object to execute
 */
function parseCommand(args) {
  // get all the commands
  const yargV = yargs(args.slice(2))
    .command(ACTION_TOKEN_ADD, "Add and save your Codiga API token")
    .command(
      ACTION_TOKEN_CHECK,
      "Check if you have a valid Codiga API token saved"
    )
    .command(
      ACTION_TOKEN_DELETE,
      "Delete a saved Codiga API token from your system"
    )
    .command(
      `${ACTION_GIT_PUSH_HOOK} [options]`,
      "Use in a git pre-push hook to check for new violations between two commits",
      {
        [OPTION_LOCAL_SHA]: {
          describe: "The local SHA being pushed",
          type: "string",
        },
        [OPTION_REMOTE_SHA]: {
          describe:
            "The remote SHA (If new branch, our CLI passes it automatically)",
          type: "string",
        },
      }
    )
    .command(ACTION_RULESET_ADD, "Add rulesets to a `codiga.yml` file")
    .help(true).argv;

  // format any actions into a single object with default values
  const actions = {
    [ACTION_TOKEN_ADD]: yargV["_"].includes(ACTION_TOKEN_ADD) || false,
    [ACTION_TOKEN_CHECK]: yargV["_"].includes(ACTION_TOKEN_CHECK) || false,
    [ACTION_TOKEN_DELETE]: yargV["_"].includes(ACTION_TOKEN_DELETE) || false,
    [ACTION_GIT_PUSH_HOOK]: yargV["_"].includes(ACTION_GIT_PUSH_HOOK) || false,
    [ACTION_RULESET_ADD]: yargV["_"].includes(ACTION_RULESET_ADD) || false,
  };

  // how many actions were detected in the command ran
  const numOfActionsReceived = Object.values(actions).filter(
    (action) => !!action
  ).length;

  // we need at least one action
  if (numOfActionsReceived === 0) {
    printEmptyLine();
    yargs.showHelp();
    printEmptyLine();
    process.exit(1);
  }

  // more than one action isn't supported
  if (numOfActionsReceived > 1) {
    printFailure("Combining two command actions together isn't supported");
    printCommandSuggestion("View available commands by running:", "--help");
    process.exit(1);
  }

  // get the action that was run
  const selectedAction = Object.keys(actions).find((action) => actions[action]);

  // format any options into an single object with default values
  const options = {
    [OPTION_LOCAL_SHA]: yargV[OPTION_LOCAL_SHA] || null,
    [OPTION_REMOTE_SHA]: yargV[OPTION_REMOTE_SHA] || null,
  };

  const parameters = yargV["_"].slice(1);

  // the parsed/formatted result
  return {
    action: selectedAction,
    options,
    parameters,
  };
}

export async function cli(args) {
  const {
    action,
    options: { [OPTION_LOCAL_SHA]: localSha, [OPTION_REMOTE_SHA]: remoteSha },
    parameters,
  } = parseCommand(args);

  switch (action) {
    case ACTION_TOKEN_ADD:
      return await addCodigaToken();
    case ACTION_TOKEN_CHECK:
      return await checkCodigaToken();
    case ACTION_TOKEN_DELETE:
      return await deleteCodigaToken();
    case ACTION_GIT_PUSH_HOOK:
      return await checkPush(remoteSha, localSha);
    case ACTION_RULESET_ADD:
      return await addRuleset(parameters);
    default:
      return (() => {
        printEmptyLine();
        yargs.showHelp();
        printEmptyLine();
        process.exit(1);
      })();
  }
}
