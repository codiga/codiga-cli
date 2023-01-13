import {
  executeGitCommand,
  findClosestSha,
  getGitDirectoryRequired,
} from "../utils/git";
import {
  getRulesetsFromCodigaFile,
  getRulesetsWithRules,
} from "../utils/rulesets";
import { analyzeFiles } from "../utils/rosie";
import { convertRulesetsToRules } from "../utils/rules";
import {
  printEmptyLine,
  printFailure,
  printInfo,
  printSubItem,
  printSuccess,
  printSuggestion,
  printViolation,
} from "../utils/print";
import { BLANK_SHA } from "../utils/constants";
import { isTestMode } from "../tests/test-utils";

/**
 * Gets the changed file paths between two SHAs
 * @param {string} remoteSHA
 * @param {string} localSHA
 */
function getChangedFilePaths(remoteSHA, localSHA) {
  const diff = executeGitCommand([
    "diff",
    "--name-only",
    "--diff-filter=d",
    remoteSHA,
    localSHA,
  ]);
  if (!diff) {
    printEmptyLine();
    printFailure(
      `We were unable to get the difference between ${remoteSHA} and ${localSHA}`
    );
    printSuggestion(
      " ↳ Please review your SHAs above and contact support, if needed:",
      "https://app.codiga.io/support"
    );
    printEmptyLine();
    process.exit(1);
  }
  return diff.split("\n").filter((s) => s);
}

/**
 * Check the given SHAs to see if we should continue on and
 * whether we need to use a different remote SHA string
 * @param {string} remoteShaArg
 * @param {string} localShaArg
 * @returns {{ remoteSha: string, localSha: string }} updated SHAs strings
 */
export function checkSHAs(remoteShaArg, localShaArg) {
  let remoteSha = remoteShaArg;
  let localSha = localShaArg;

  // check if we're on a new branch
  if (remoteShaArg === BLANK_SHA) {
    // search for the closest SHA to compare against
    const closestRemoteSha = findClosestSha();
    // if we find one, we'll use it, otherwise we'll notify the user and exit
    if (closestRemoteSha) {
      remoteSha = closestRemoteSha;
    } else {
      printInfo(
        "Tried to find closest SHA but did not find any; exiting with code 0"
      );
      process.exit(0);
    }
  }

  if (remoteSha === localSha) {
    printInfo(
      `Remote and local SHA are the same (${remoteSha}); exiting with code 0`
    );
    process.exit(0);
  }

  if (isTestMode) {
    return {
      remoteSha: remoteShaArg,
      localSha: localShaArg,
    };
  }

  return {
    remoteSha,
    localSha,
  };
}

/**
 * Checks the diff between two SHAs and runs any Rosie rules
 * found in the codiga.yml file rulesets
 * @param {string} remoteSHA
 * @param {string} localSHA
 */
export async function checkPush(remoteShaArg, localShaArg) {
  if (!remoteShaArg || !localShaArg) {
    printFailure("You need to pass in both remote and local SHA values");
    printSuggestion(
      " ↳ Refer to our documentation for more info:",
      "https://doc.codiga.io/docs/cli/#analysis-and-report-issues-between-two-commits"
    );
    process.exit(1);
  }

  // ensure that there's a git directory to continue
  getGitDirectoryRequired();

  // check and verify the SHA args
  const { remoteSha, localSha } = checkSHAs(remoteShaArg, localShaArg);

  // get the ruleset names from the codiga.yml file
  const rulesetNames = getRulesetsFromCodigaFile();

  // get the rules for all the rulesets in the codiga file
  const rulesetsWithRules = await getRulesetsWithRules(rulesetNames);

  // get an array of all the rules from the rulesets
  const rules = convertRulesetsToRules(rulesetsWithRules);

  // get a list of all the files that have changed
  const changedFilePaths = getChangedFilePaths(remoteSha, localSha);

  // we analyze all the changed files and get back a list of violations and (network) errors
  const { violations, errors } = await analyzeFiles(changedFilePaths, rules);

  // print out our violations
  if (violations.length === 0) {
    printEmptyLine();
    printSuccess("Codiga found 0 violations");
    printEmptyLine();
  } else {
    printEmptyLine();
    printFailure(
      `Codiga found ${violations.length} violation${
        violations.length === 1 ? "" : "s"
      }:`
    );
    violations.forEach((violation, index) => {
      printViolation(index + 1, violation);
    });
    printEmptyLine();
  }

  if (errors.length > 0) {
    printFailure("There were network errors while processing the following:");
    errors.forEach((error) => {
      printSubItem(`- ${error}`);
    });
    printEmptyLine();
    printSuggestion(
      "Please try again or contact our support:",
      "https://www.codiga.io/contact-us/"
    );
    printEmptyLine();
  }

  if (violations.length === 0 && errors.length === 0) {
    process.exit(0);
  } else {
    printEmptyLine();
    printInfo("Do you consider these violations as false positives?");
    printSuggestion(
      " ↳ You can add the following flag to your `git push` to bypass this check:",
      "--no-verify"
    );
    printSuggestion(
      " ↳ Consider commenting on those rules in the Codiga Hub, so the maintainer can improve them:",
      "https://app.codiga.io/hub/rulesets"
    );
    printEmptyLine();
    process.exit(1);
  }
}
