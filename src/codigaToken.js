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
import { setToken, getToken, deleteToken } from "../utils/store";

/**
 * Returns whether an API token is valid
 * @param {string} apiToken the token string to check
 * @returns {Promise<boolean>} whether the token is valid
 */
async function checkIfTokenIsValid(apiToken) {
  try {
    const resp = await codigaApiFetch(CHECK_USER, null, apiToken);
    if (resp?.user?.id) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

/**
 * Handles the checking and messaging when checking a
 * token with the `token-check` command action
 */
export async function checkCodigaToken() {
  const token = getToken();
  if (token) {
    if (await checkIfTokenIsValid(token)) {
      printSuccess("A valid API token was found.");
      printCommandSuggestion(
        " ↳ If you wish to override it, run one of the following commands:",
        ACTION_TOKEN_ADD
      );
      process.exit(0);
    } else {
      printInfo("An invalid token was found");
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
      if (await checkIfTokenIsValid(apiToken)) {
        setToken(apiToken);
        printSuccess("Codiga API token added");
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
      process.exit(1);
    } else {
      printSuccess("Codiga API token deleted.");
      process.exit(0);
    }
  } else {
    printInfo("No Codiga API token was found to delete.");
    printCommandSuggestion(
      " ↳ To set a Codiga API token, run one of the following commands:",
      ACTION_TOKEN_ADD
    );
    process.exit(1);
  }
}
