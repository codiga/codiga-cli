import path from "path";
import { ACTION_TOKEN_ADD } from "../utils/constants";
import { getAllDirectoryFiles, getIsDirectory } from "../utils/directory";
import { formatAndOutputAnalysis } from "../utils/output";
import {
  printCommandSuggestion,
  printEmptyLine,
  printFailure,
  printInfo,
  printSubItem,
  printSuccess,
  printSuggestion,
} from "../utils/print";
import { analyzeFiles } from "../utils/rosie";
import { convertRulesetsToRules } from "../utils/rules";
import {
  getRulesetsByNames,
  getRulesetsFromCodigaFile,
  getRulesetsWithRules,
} from "../utils/rulesets";

export async function analyze(
  givenFileOrDir,
  { output, followSymlinks, format, rulesets: givenRulesets }
) {
  // get the given path or set the default to the current location
  const fileOrDir = givenFileOrDir[0] || "./";

  const isDirectory = await getIsDirectory(fileOrDir);
  if (isDirectory === null) {
    printFailure(`No such file or directory to analyze: ${fileOrDir}`);
    process.exit(1);
  }

  const isAbsolute = path.isAbsolute(fileOrDir);
  const rootPath = isAbsolute
    ? fileOrDir
    : path.resolve(process.cwd(), fileOrDir);

  /**
   * If rulesets are given in the command, we only use those on an analysis
   * If rulesets are NOT given in the command, there MUST be a codiga.yml in the directory being analyzed
   * - Unless we're analyzing a single file - then the rulesets must be passed in through the command
   */
  let rulesetNames;
  if (givenRulesets) {
    rulesetNames = givenRulesets;
  } else {
    if (isDirectory) {
      rulesetNames = await getRulesetsFromCodigaFile(rootPath);
    } else {
      printEmptyLine();
      printFailure(`No rulesets were given to analyze this file: ${rootPath}`);
      printSuggestion(
        " ↳ When you specify a file to analyze, you must add rulesets in your command manually like this:",
        "codiga analyze file.txt --ruleset fake-ruleset"
      );
      printEmptyLine();
      process.exit(1);
    }
  }

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
  } else {
    printEmptyLine();
    printInfo("Using the following rulesets to analyze for violations:");
    validRulesets.forEach((validRulesetsRuleset) => {
      printSubItem(`- ${validRulesetsRuleset}`);
    });
  }

  // get the rules for all the rulesets in the codiga file
  const rulesetsWithRules = await getRulesetsWithRules(rulesetNames);

  // get an array of all the rules from the rulesets
  const rules = convertRulesetsToRules(rulesetsWithRules);

  const filesToAnalyze = isDirectory
    ? await getAllDirectoryFiles(rootPath, followSymlinks)
    : [rootPath];

  // we analyze all the changed files and get back a list of violations and (network) errors
  const { violations, errors } = await analyzeFiles(
    filesToAnalyze,
    rules,
    rootPath
  );

  if (errors.length > 0) {
    printEmptyLine();
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

  if (violations.length === 0) {
    printEmptyLine();
    printSuccess("Codiga analysis complete");
    console.log(" ↳ 0 violations were reported");
    printEmptyLine();
  } else {
    await formatAndOutputAnalysis({ violations, output, format });
  }

  process.exit(0);
}
