import inquirer from "inquirer";
import { parseYamlFile, readFile } from "../utils/file";
import { codigaApiFetch } from "./api";
import {
  ACTION_TOKEN_ADD,
  CATEGORY_CHOICES,
  CODIGA_CONFIG_FILE,
  RULESET_CHOICES,
} from "./constants";
import { getGitDirectoryRequired } from "./git";
import { GET_RULESETS_FOR_CLIENT } from "../graphql/queries";
import {
  printCommandSuggestion,
  printEmptyLine,
  printFailure,
  printSuggestion,
} from "./print";
import { getToken } from "./store";
import { buildRulesetsQuery } from "./graphql";
import { isTestMode } from "../tests/test-utils";
import { getRulesetsByNamesMock } from "../tests/fixtures/rulesetsMock";

/**
 * Gets an array of rulesets and their rules
 * @param {string[]} names - the names of the rulesets to get
 */
export async function getRulesetsWithRules(names) {
  try {
    if (!getToken()) {
      throw new Error("Not Authorized");
    }
    const resp = await codigaApiFetch(GET_RULESETS_FOR_CLIENT, { names });
    const rulesetsWithRules = resp.ruleSetsForClient || [];
    return rulesetsWithRules;
  } catch (err) {
    // console.debug(err);
    printFailure("We were unable to fetch your rulesets");
    printCommandSuggestion(
      " ↳ Set a Codiga API token with one of the following commands:",
      ACTION_TOKEN_ADD
    );
    process.exit(1);
  }
}

/**
 * reads and returns the rulesets for a codiga config file
 * @param {string} path (default = codiga.yml)
 * @returns
 */
export function getRulesetsFromCodigaFile() {
  const rootDir = getGitDirectoryRequired();

  const codigaFileLocation = `${rootDir}/${CODIGA_CONFIG_FILE}`;
  const codigaFileContent = readFile(codigaFileLocation);
  if (!codigaFileContent) {
    printEmptyLine();
    printFailure(`Unable to read a codiga.yml file`);
    printSuggestion(
      " ↳ Please ensure you have a codiga.yml here:",
      codigaFileLocation
    );
    printSuggestion(
      " ↳ Search for rulesets to add to it here:",
      "https://app.codiga.io/hub/rulesets"
    );
    printEmptyLine();
    process.exit(1);
  }
  const parsedFile = parseYamlFile(codigaFileContent, codigaFileLocation);

  // if there isn't a rulesets value in the codiga.yml file, throw an error
  if (!parsedFile) {
    printFailure("We couldn't find a `rulesets` value to get rulesets from");
    printSuggestion(
      " ↳ Ensure you have a `rulesets:` value in: ",
      codigaFileLocation
    );
    printSuggestion(
      " ↳ You can search for rulesets here:",
      "https://app.codiga.io/hub/rulesets"
    );
    process.exit(1);
  }

  // if there aren't any ruleset items under `rulesets:` in the codiga.yml file, throw an error
  if (!parsedFile.rulesets) {
    printFailure(
      "We can't look for violations if there are no rulesets listed in your `codiga.yml` file"
    );
    printSuggestion(
      " ↳ Ensure you have rulesets listed in: ",
      codigaFileLocation
    );
    printSuggestion(
      " ↳ You can search for more rulesets here:",
      "https://app.codiga.io/hub/rulesets"
    );
    process.exit(1);
  }

  const rulesets = cleanParsedCodigaFile(parsedFile);
  return rulesets;
}

/**
 * we remove certain values :
 * - null values (`null`)
 * - sub list concatenated item strings (`ruleset-name - sub-item - sub-item2`)
 */
function cleanParsedCodigaFile(parsedContent) {
  const rulesets = parsedContent.rulesets
    .filter((ruleset) => ruleset)
    .map((ruleset) => ruleset.split(" ")[0]);
  return rulesets;
}

/**
 * When given an array of ruleset names, this will fetch to
 * ensure they exist and returns these in a found/notFound array
 * If an error occurs while fetching this will exit with a 1
 * @param {string[]} names
 * @returns {Promise<{found: string[], notFound: string[]}>}
 */
export async function getRulesetsByNames(names) {
  if (isTestMode) return getRulesetsByNamesMock(names);
  try {
    const { query, aliasMap } = buildRulesetsQuery(names);
    const resp = await codigaApiFetch(query);

    const { found, notFound } = Object.entries(resp).reduce(
      (acc, [alias, ruleset]) => {
        if (ruleset === null) {
          acc.notFound.push(aliasMap[alias]);
        } else {
          acc.found.push(aliasMap[alias]);
        }
        return acc;
      },
      {
        found: [],
        notFound: [],
      }
    );

    return { found, notFound };
  } catch (err) {
    printFailure("We were unable to fetch those rulesets");
    printSuggestion(
      " ↳ If the issue persists, contact us at:",
      "https://app.codiga.io/support"
    );
    process.exit(1);
  }
}

/**
 * Prompts the user through interactive menus to get rulesets
 * @returns {Promise<string[]>}
 */
export async function getUserPromptedRulesets() {
  const { category } = await inquirer.prompt({
    type: "list",
    name: "category",
    pageSize: CATEGORY_CHOICES.length,
    message: "Please select one category:",
    choices: CATEGORY_CHOICES,
  });

  const { rulesets } = await inquirer.prompt({
    type: "checkbox",
    name: "rulesets",
    message: "Please select all the rulesets you'd like to add",
    choices: RULESET_CHOICES[category].map((ruleset) => ({
      type: "checkbox",
      name: ruleset,
    })),
  });

  return rulesets;
}

export function convertRulesetsToString(rulesets) {
  return `rulesets:\n${rulesets
    .filter((x) => x)
    .map((ruleset) => `  - ${ruleset}\n`)
    .join("")}`;
}
