import { readFile, parseYamlFile } from "../utils/file";
import { codigaApiFetch } from "./api";
import { ACTION_TOKEN_CHECK, CODIGA_CONFIG_FILE } from "./constants";
import { getRootDirectory } from "./git";
import { GET_RULESETS_FOR_CLIENT } from "../graphql/queries";
import { printError, printSuggestion } from "./print";

/**
 * Gets an array of rulesets and their rules
 * @param {string[]} names - the names of the rulesets to get
 */
export async function getRulesetsWithRules(names) {
  try {
    const resp = await codigaApiFetch(GET_RULESETS_FOR_CLIENT, { names });
    const rulesetsWithRules = resp.ruleSetsForClient || [];
    return rulesetsWithRules;
  } catch (err) {
    // console.debug(err);
    printError("Unable to fetch your rulesets", "008");
    printSuggestion(
      " ↳ Ensure you have a Codiga API token set with the following command:",
      `codiga ${ACTION_TOKEN_CHECK}`
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
  const rootDir = getRootDirectory();

  const codigaFileLocation = `${rootDir}/${CODIGA_CONFIG_FILE}`;
  const file = readFile(codigaFileLocation);
  const parsedFile = parseYamlFile(file, codigaFileLocation);

  // if there isn't a rulesets value in the codiga.yml file, throw an error
  if (!parsedFile) {
    printError("no rulesets value found in codiga.yml", "006");
    process.exit(1);
  }

  // if there aren't any ruleset items under `rulesets:` in the codiga.yml file, throw an error
  if (!parsedFile.rulesets) {
    printError("no rulesets found in codiga.yml", "007");
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
