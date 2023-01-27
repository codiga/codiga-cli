import pLimit from "p-limit";
import { Listr } from "listr2";
import path from "path";
import { encodeToBase64 } from "../utils/encoding";
import { rosieApiFetch } from "./api";
import { getLanguageForFile, readFileRequired } from "./file";
import { getRulesForRosiePerLanguage } from "./rules";
import {
  printEmptyLine,
  printFailure,
  printInfo,
  printSubItem,
  setPrintToStdErr,
  setPrintToStdOut,
} from "./print";
import {
  CONCURRENT_ROSIE_REQUESTS_COUNT,
  IGNORED_FILES_LISTED_COUNT,
  UPDATE_ANALYSIS_HEADER_IN_MS,
} from "./constants";

const limit = pLimit(CONCURRENT_ROSIE_REQUESTS_COUNT);

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
export async function analyzeFiles(paths, rules, rootDir) {
  try {
    // we won't analyze files for languages that aren't supported
    const files = managePathsBySupportAndLanguage(paths);

    printEmptyLine();
    // if there's are unsupported files we'll log that with a notice
    const numOfUnsupportedFiles = files.notSupported.length;
    if (numOfUnsupportedFiles !== 0) {
      printInfo(
        `Codiga will skip analyzing ${numOfUnsupportedFiles} files as the language is not supported yet:`
      );
      files.notSupported
        .slice(0, IGNORED_FILES_LISTED_COUNT)
        .forEach((file) => {
          printSubItem(`- ${file}`.trim());
        });
      if (numOfUnsupportedFiles - IGNORED_FILES_LISTED_COUNT > 0) {
        printSubItem(
          `  + ${numOfUnsupportedFiles - IGNORED_FILES_LISTED_COUNT} more files`
        );
      }
      printEmptyLine();
    }

    const detectedLanguages = Object.keys(files).filter(
      (k) => k !== "notSupported"
    );

    let filesAndRules = [];

    detectedLanguages.forEach((language) => {
      files[language].forEach((file) => {
        const fileContent = readFileRequired(path.resolve(rootDir, file));
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

    const getTitle = (totalFiles, pendingCount) =>
      `Analyzing ${totalFiles} file${
        totalFiles === 1 ? "" : "s"
      } for violations (${totalFiles - pendingCount}/${totalFiles})`;

    const tasks = new Listr([
      {
        title: getTitle(filesAndRules.length, 0),
        task: async (_, task) => {
          // create an array of Rosie API wrapped concurrent promises
          const promises = filesAndRules.map((body) =>
            limit(() => rosieApiFetch(body))
          );

          // on an interval we'll
          const intervalId = setInterval(() => {
            task.title = getTitle(filesAndRules.length, limit.pendingCount);
          }, UPDATE_ANALYSIS_HEADER_IN_MS);

          /**
           * Waiting for all our analysis promises to settle here. We
           * can review the individual results for success and for any
           * unsuccessful ones, we can relay to that to the user
           */
          await Promise.allSettled(promises)
            .then((results) => {
              task.title = getTitle(filesAndRules.length, limit.pendingCount);
              clearInterval(intervalId);
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
              task.title = getTitle(filesAndRules.length, limit.pendingCount);
              clearInterval(intervalId);
              setPrintToStdErr();
              printFailure(err.message);
              setPrintToStdOut();
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
    setPrintToStdErr();
    printFailure(err.message);
    setPrintToStdOut();
    process.exit(1);
  }
}
