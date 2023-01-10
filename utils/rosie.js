import { Listr } from "listr2";
import { encodeToBase64 } from "../utils/encoding";
import { rosieApiFetch } from "./api";
import { getLanguageForFile, readFile } from "./file";
import { getRulesForRosiePerLanguage } from "./rules";
import { printEmptyLine, printFailure, printInfo, printSubItem } from "./print";

/**
 * Used to filter out unsupported language files and
 * combine similar language files together
 * @param {string[]} paths
 * @returns {{notSupported: string[], 'language': string[]}}
 */
export function managePathsBySupportAndLanguage(paths) {
  return paths.reduce(
    (acc, path) => {
      const fileLanguage = getLanguageForFile(path);
      if (!fileLanguage) {
        acc.notSupported.push(path);
      } else {
        if (acc[fileLanguage]) {
          acc[fileLanguage].push(path);
        } else {
          acc[fileLanguage] = [path];
        }
      }
      return acc;
    },
    {
      notSupported: [],
    }
  );
}

/**
 * Run a Rosie check on the given paths against with the given rules
 * @param {string[]} paths
 * @param {RosieRule} rules
 */
export async function analyzeFiles(paths, rules) {
  try {
    // we won't analyze files for languages that aren't supported
    const files = managePathsBySupportAndLanguage(paths);

    printEmptyLine();
    // if there's are unsupported files we'll log that with a notice
    if (files.notSupported.length !== 0) {
      printInfo(
        "Codiga will skip analyzing the following files as their language is not supported yet"
      );
      files.notSupported.forEach((file) => {
        printSubItem(`- ${file}`.trim());
      });
      printEmptyLine();
    }

    const detectedLanguages = Object.keys(files).filter(
      (k) => k !== "notSupported"
    );

    let filesAndRules = [];

    detectedLanguages.forEach((language) => {
      files[language].forEach((file) => {
        const fileContent = readFile(file);
        const body = {
          filename: file,
          language: language.toLowerCase(),
          fileEncoding: "utf8",
          codeBase64: encodeToBase64(fileContent),
          rules: getRulesForRosiePerLanguage(rules, language),
          logOutput: false,
        };
        filesAndRules.push(body);
      });
    });

    let violations = [];
    let errors = [];

    const tasks = new Listr([
      {
        title: `Analyzing ${filesAndRules.length} file${
          filesAndRules.length === 1 ? "" : "s"
        } for violations`,
        task: async () => {
          // create an array of Rosie API promises
          const promises = filesAndRules.map(
            async (body) => await rosieApiFetch(body)
          );

          /**
           * Waiting for all our analysis promises to settle here. We
           * can review the individual results for success and for any
           * unsuccessful ones, we can relay to that to the user
           */
          await Promise.allSettled(promises)
            .then((results) => {
              results.forEach((result, fileIndex) => {
                /**
                 * if the promise is unsuccessful, we'll add the
                 * filename to an errors array to notify the user
                 */
                if (result.status === "rejected") {
                  errors.push(filesAndRules[fileIndex].filename);
                }

                /**
                 * if the promise is successful, we'll add any
                 * violations detected to our violations array
                 */
                if (result.status === "fulfilled") {
                  const ruleResponses = result.value;
                  ruleResponses.forEach((ruleResponse) => {
                    ruleResponse.violations.forEach((violation) => {
                      violations.push({
                        filename: filesAndRules[fileIndex].filename,
                        ...violation,
                      });
                    });
                  });
                }
              });
            })
            .catch((err) => {
              printFailure(err.message);
              process.exit(1);
            });
        },
      },
    ]);

    await tasks.run();

    const sortedViolations = violations.sort((a, b) => a.filename - b.filename);

    return {
      violations: sortedViolations,
      errors,
    };
  } catch (err) {
    // console.debug(err);
    printFailure(err.message);
    process.exit(1);
  }
}
