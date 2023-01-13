import { writeFile } from "fs/promises";
import { isTestMode } from "../tests/test-utils";
import {
  ACTION_RULESET_ADD,
  ACTION_TOKEN_ADD,
  CODIGA_CONFIG_FILE,
} from "../utils/constants";
import { readFile, parseYamlFile } from "../utils/file";
import { getGitDirectory } from "../utils/git";
import {
  printCommandSuggestion,
  printEmptyLine,
  printFailure,
  printInfo,
  printSuggestion,
} from "../utils/print";
import { convertRulesetsToString, getRuleset } from "../utils/ruleset";

/**
 * Creates a codiga.yml file's content with the rulesets given
 * Note: because this overrides the file, you need to pass any old rulesets that should remain
 * @param {string[]} rulesets
 */
export async function createCodigaYml(codigaFileLocation, rulesets) {
  if (isTestMode) return;
  try {
    await writeFile(codigaFileLocation, convertRulesetsToString(rulesets), {
      encoding: "utf-8",
    });
  } catch (err) {
    // console.debug(err);
    printEmptyLine();
    printFailure(`We were unable to write to: ${codigaFileLocation}`);
    printSuggestion(
      " ↳ Please try again and contact us, if the issue persists:",
      "https://app.codiga.io/support"
    );
    printEmptyLine();
    process.exit(1);
  }
}

/**
 * Handles adding a ruleset to a codiga.yml file
 * @param {string[]} rulesetNames
 */
export async function addRuleset(rulesetNames) {
  // TODO - change to a prompt when no rulesets are given
  const rulesetName = rulesetNames[0];
  if (!rulesetName) {
    printEmptyLine();
    printFailure("You need to specify a ruleset to add");
    printSuggestion(
      " ↳ You can search for rulesets here:",
      "https://app.codiga.io/hub/rulesets"
    );
    printCommandSuggestion(
      " ↳ Then follow this command structure:",
      `${ACTION_RULESET_ADD} <ruleset-name>`
    );
    printEmptyLine();
    process.exit(1);
  }

  // Check if the ruleset exists before continuing onwards
  const ruleset = await getRuleset({ name: rulesetName });
  if (!ruleset) {
    printEmptyLine();
    printFailure(
      "That ruleset either doesn't exist or you lack the permissions to access it"
    );
    printCommandSuggestion(
      " ↳ Ensure you have a Codiga API token set with one of the following commands:",
      ACTION_TOKEN_ADD
    );
    printSuggestion(
      " ↳ You can find more rulesets here:",
      "https://app.codiga.io/hub/rulesets"
    );
    printEmptyLine();
    process.exit(1);
  }

  /**
   * Get the `codiga.yml` file location and content.
   * We'll look in the git directory, if it exists.
   * Otherwise, we'll look in the current directory
   */
  const gitDirectory = getGitDirectory();
  const dir = gitDirectory || process.cwd();
  const codigaFileLocation = `${dir}/${CODIGA_CONFIG_FILE}`;
  const codigaFileContent = readFile(codigaFileLocation);

  /**
   * If we found a `codiga.yml` file, add the rule to it
   * If we don't find a `codiga.yml` file, create the file and add the rule to it
   */
  if (codigaFileContent) {
    const parsedFile = parseYamlFile(codigaFileContent, codigaFileLocation);
    const codigaRulesets = parsedFile.rulesets;
    if (codigaRulesets.includes(rulesetName)) {
      printEmptyLine();
      printInfo(
        `The ruleset (${rulesetName}) already exists in your \`codiga.yml\``
      );
      printSuggestion;
      printEmptyLine();
      process.exit(1);
    } else {
      // adding the new ruleset to the file
      await createCodigaYml(codigaFileLocation, [
        ...codigaRulesets,
        rulesetName,
      ]);
      printSuggestion(
        `We added ${rulesetName} to your codiga.yml file:`,
        codigaFileLocation
      );
      printSuggestion(
        " ↳ Find more rulesets to add here:",
        "https://app.codiga.io/hub/rulesets"
      );
    }
  } else {
    // creating a new codiga.yml with the ruleset here
    await createCodigaYml(codigaFileLocation, [rulesetName]);
    printSuggestion(
      `No codiga.yml file found, so we created one and added ${rulesetName} to it:`,
      codigaFileLocation
    );
    printSuggestion(
      " ↳ Find more rulesets to add here:",
      "https://app.codiga.io/hub/rulesets"
    );
  }

  process.exit(0);
}
