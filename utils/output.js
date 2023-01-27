import { existsSync } from "fs";
import { writeFile } from "fs/promises";
import { stringify } from "csv-stringify/dist/esm/sync";
import {
  OPTION_FORMAT_CSV,
  OPTION_FORMAT_JSON,
  OPTION_OUT_DEFAULT,
} from "./constants";
import {
  printEmptyLine,
  printFailure,
  printSuccess,
  printSuggestion,
  setPrintToStdErr,
  setPrintToStdOut,
} from "./print";

/**
 * Formats and outputs the violations accordingly
 * @param {{violations, output, format, analysisTime}}
 */
export async function formatAndOutputAnalysis({
  violations,
  output,
  format,
  analysisTime,
}) {
  const content = await formatAnalysis(violations, format);
  await outputAnalysis(output, content, violations.length, analysisTime);
}

/**
 * Format the violations accordingly
 * @param {string} violations
 * @param {number} format
 */
export async function formatAnalysis(violations, format) {
  const formattedViolations = violations.map((violation) => ({
    filename: `${violation.filename}:${violation.start.line}:${violation.start.col}`,
    message: violation.message,
    severity: violation.severity,
    category: violation.category,
  }));

  let content = "";

  if (format === OPTION_FORMAT_CSV) {
    content = stringify(formattedViolations, {
      header: true,
      eof: false,
      columns: {
        filename: "File",
        message: "Message",
        severity: "Severity",
        category: "Category",
      },
    });
  } else if (format === OPTION_FORMAT_JSON) {
    content = JSON.stringify(formattedViolations, null, 2);
  } else {
    content = formattedViolations.reduce((acc, v, i) => {
      const violation = `${v.filename} - ${v.message} (${v.severity}/${v.category})`;
      const newline = i === formattedViolations.length - 1 ? "" : "\n";
      return acc + violation + newline;
    }, "Filename - Message (Severity/Category)\n");
  }

  return content;
}

/**
 * Write the content to a file or to the stdout
 * @param {string} outputFile
 * @param {string} content
 * @param {number} numOfViolations
 * @param {number} analysisTime
 */
async function outputAnalysis(
  outputFile,
  content,
  numOfViolations,
  analysisTime
) {
  printEmptyLine();

  // outputting the results right onto the stdout
  if (outputFile === OPTION_OUT_DEFAULT) {
    console.log("---------RESULTS START--------");
    console.log(content);
    console.log("---------RESULTS END----------");
    printEmptyLine();
    printSuccess(`Codiga analysis completed in ${analysisTime} sec`);
    printSuggestion(
      ` ↳ ${numOfViolations} violation${
        numOfViolations === 1 ? " was" : "s were"
      } found for you to review above`,
      ""
    );
    printEmptyLine();
    process.exit(0);
  }

  // outputting the results into a file
  if (outputFile !== OPTION_OUT_DEFAULT) {
    // create a file with the results
    await writeFile(outputFile, content);
    // check if the file was created
    if (existsSync(outputFile)) {
      printSuccess(`Codiga analysis completed in ${analysisTime} sec`);
      printSuggestion(
        ` ↳ ${numOfViolations} violation${
          numOfViolations === 1 ? " was" : "s were"
        } found for you to review:`,
        outputFile
      );
      printEmptyLine();
      process.exit(0);
    } else {
      setPrintToStdErr();
      printFailure("An error occurred while creating your results file");
      printSuggestion(
        " ↳ Please try again and contact us, if the issue persists:",
        "https://app.codiga.io/support"
      );
      printEmptyLine();
      setPrintToStdOut();
      process.exit(1);
    }
  }
}
