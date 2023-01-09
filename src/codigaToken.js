import inquirer from "inquirer";
import { CHECK_USER } from "../graphql/queries";
import { codigaApiFetch } from "../utils/api";
import { ACTION_TOKEN_ADD } from "../utils/constants";
import {
  printSuggestion,
  printFailure,
  printInfo,
  printSuccess,
  printCommandSuggestion,
} from "../utils/print";
import { setToken, getToken, deleteToken, store } from "../utils/store";

/**
 * Returns the user details for a valid API token
 * @param {string} apiToken the token string to check
 * @returns {Promise<{id: string, accountType: string, username: string}?>} the user if a valid token
 */
async function getUserInfoFromToken(apiToken) {
  try {
    const resp = await codigaApiFetch(CHECK_USER, null, apiToken);
    if (resp?.user?.id) {
      return resp.user;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

/**
 * Handles the checking and messaging when checking a
 * token with the `token-check` command action
 */
export async function checkCodigaToken() {
  const token = getToken();
  if (token) {
    const user = await getUserInfoFromToken(token);
    if (!!user) {
      printSuccess(
        `A valid API token was found for ${user.username} (${user.accountType})`
      );
      printSuggestion(`Tokens can be found here:`, store.path);
      printCommandSuggestion(
        " ↳ If you wish to override it, run one of the following commands:",
        ACTION_TOKEN_ADD
      );
      process.exit(0);
    } else {
      printInfo("An invalid token was found");
      printSuggestion(`Tokens can be found here:`, store.path);
      printCommandSuggestion(
        " ↳ To override it, run one of the following commands:",
        ACTION_TOKEN_ADD
      );
      process.exit(0);
    }
  } else {
    printInfo("No token was found.");
    printCommandSuggestion(
      " ↳ To set an API token, run one of the following commands:",
      ACTION_TOKEN_ADD
    );
    process.exit(1);
  }
}

/**
 * Handles asking, verifying, setting and the messaging
 * when the `token-add` command action is run
 */
export async function addCodigaToken() {
  printSuggestion(
    "Create a Codiga API token:",
    "https://app.codiga.io/api-tokens"
  );
  inquirer
    .prompt([
      {
        type: "input",
        name: "apiToken",
        message: "Please enter your API token:",
      },
    ])
    .then(async ({ apiToken }) => {
      const user = await getUserInfoFromToken(apiToken);
      if (!!user) {
        setToken(apiToken);
        printSuccess(
          `Codiga API token added for ${user.username} (${user.accountType})`
        );
        printSuggestion(`Tokens can be found here:`, store.path);
        process.exit(0);
      } else {
        printFailure("That token is not valid");
        printSuggestion(
          " ↳ Go to Codiga and create a new token:",
          "https://app.codiga.io/api-tokens"
        );
        process.exit(1);
      }
    })
    .catch((err) => {
      printFailure(err.message);
      process.exit(1);
    });
}

/**
 * Handles deleting a token, if there is one, and the messaging
 * when the `token-delete` command action is run
 */
export async function deleteCodigaToken() {
  if (getToken()) {
    deleteToken();
    // ensure the token was deleted
    if (getToken()) {
      printFailure("We couldn't delete your Codiga API token");
      printSuggestion(`Tokens can be found here:`, store.path);
      printSuggestion(
        " ↳ If the issue persists, contact us at:",
        "https://app.codiga.io/support"
      );
      process.exit(1);
    } else {
      printSuccess("Codiga API token deleted");
      printSuggestion(`Tokens can be found here:`, store.path);
      printCommandSuggestion(
        " ↳ To set a Codiga API token, run one of the following commands:",
        ACTION_TOKEN_ADD
      );
      process.exit(0);
    }
  } else {
    printInfo("No Codiga API token was found to delete");
    printCommandSuggestion(
      " ↳ To set a Codiga API token, run one of the following commands:",
      ACTION_TOKEN_ADD
    );
    process.exit(1);
  }
}
