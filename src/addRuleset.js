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
  printSubItem,
  printSuggestion,
} from "../utils/print";
import { convertRulesetsToString } from "../utils/rulesets";
import { getRulesetsByNames, getUserPromptedRulesets } from "../utils/rulesets";

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
export async function addRuleset(rulesetNamesParams) {
  let rulesetNames = rulesetNamesParams;

  /**
   * if `codiga ruleset-add` was called with no rulesets, we'll
   * open an interactive menu for them to select suggested rulesets
   */
  if (rulesetNamesParams.length === 0) {
    // prompt the user to choose some rulesets
    rulesetNames = await getUserPromptedRulesets();
    // if the user didn't choose any notify them and exit
    if (rulesetNames.length === 0) {
      printEmptyLine();
      printInfo("No rulesets were chosen.");
      printCommandSuggestion(
        " ↳ Run the command again to get started:",
        ACTION_RULESET_ADD
      );
      printSuggestion(
        " ↳ Find all publically available rulesets here:",
        "https://app.codiga.io/hub/rulesets"
      );
      printEmptyLine();
      process.exit(1);
    }
  }

  /**
   * Here we take the ruleset names that were chosen through the interactive
   * mode or were received from the command parameters, and validate which
   * ones are valid and should be added to a `codiga.yml` file and which
   * we should inform the user won't be added
   */

  const { found: validRulesets, notFound } = await getRulesetsByNames(
    rulesetNames
  );

  if (notFound.length > 0) {
    printEmptyLine();
    printFailure(
      "The following rulesets either don't exist or you lack the permissions to access it:"
    );
    notFound.forEach((notFoundRuleset) => {
      printSubItem(`- ${notFoundRuleset}`);
    });
    printCommandSuggestion(
      "Ensure you have a Codiga API token set with one of the following commands:",
      ACTION_TOKEN_ADD
    );
  }

  if (validRulesets.length === 0) {
    printEmptyLine();
    printInfo("No valid rulesets were found to continue");
    printCommandSuggestion(
      " ↳ Ensure you have a Codiga API token set with one of the following commands:",
      ACTION_TOKEN_ADD
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
   * If we found a `codiga.yml` file, add the new rulesets to it
   * If we don't find a `codiga.yml` file, create the file and add the rulesets to it
   */
  if (codigaFileContent) {
    const parsedFile = parseYamlFile(codigaFileContent, codigaFileLocation);
    const codigaRulesets = parsedFile.rulesets;

    // check which rulesets are new and which are already used in the `codiga.yml` file
    const { usedRulesets, newRulesets } = validRulesets.reduce(
      (acc, ruleset) => {
        if (codigaRulesets.includes(ruleset)) {
          acc.usedRulesets.push(ruleset);
        } else {
          acc.newRulesets.push(ruleset);
        }
        return acc;
      },
      {
        usedRulesets: [],
        newRulesets: [],
      }
    );

    if (usedRulesets.length > 0) {
      printEmptyLine();
      printInfo(
        `The following rulesets already exists in your \`codiga.yml\` file:`
      );
      usedRulesets.forEach((ruleset) => {
        printSubItem(`- ${ruleset}`);
      });
    }

    // adding the new ruleset to the file
    await createCodigaYml(codigaFileLocation, [
      ...codigaRulesets,
      ...newRulesets,
    ]);
    printEmptyLine();
    printSuggestion(
      `We added ${newRulesets.length} ruleset${
        newRulesets.length === 1 ? "" : "s"
      } to your codiga.yml file:`,
      codigaFileLocation
    );
    printSuggestion(
      " ↳ Find more rulesets to add here:",
      "https://app.codiga.io/hub/rulesets"
    );
    printEmptyLine();
  } else {
    // creating a new codiga.yml with the ruleset here
    await createCodigaYml(codigaFileLocation, newRulesets);
    printEmptyLine();
    printSuggestion(
      `No codiga.yml file found, so we created one and added ${
        newRulesets.length
      } ruleset${newRulesets.length === 1 ? "" : "s"} to it:`,
      codigaFileLocation
    );
    printSuggestion(
      " ↳ Find more rulesets to add here:",
      "https://app.codiga.io/hub/rulesets"
    );
    printEmptyLine();
  }

  process.exit(0);
}
