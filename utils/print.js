import chalk from "chalk";

/**
 * Used to space sections of output to improve readability
 */
export function printEmptyLine() {
  console.log("");
}

/**
 * Used to print an error code and message for errors that need more explanation
 * @param {string} text
 * @param {string} code
 */
export function printError(text, code) {
  console.error(`%s: ${text}`, chalk.red.bold(`ERROR (${code})`));
}

/**
 * Used to indicate something negative and needs the user's attention
 * @param {string} text
 */
export function printFailure(text) {
  console.log(chalk.red.bold(text));
}

/**
 * Used to indicate something was successful
 * @param {string} text
 */
export function printSuccess(text) {
  console.log(chalk.green.bold(text));
}

/**
 * Used to indicate some non-critical information
 * @param {string} text
 */
export function printInfo(text) {
  console.log(chalk.blue.bold(text));
}

/**
 * Used to indicate a follow-up action
 * @param {string} text
 * @param {string} suggestion
 */
export function printSuggestion(text, suggestion) {
  console.log(text, chalk.magenta(suggestion));
}

/**
 * Used to show suggested command follow ups
 * @param {string} text
 * @param {string} suggestion
 */
export function printCommandSuggestion(text, command) {
  console.log(
    text,
    chalk.magenta(`codiga ${command}`),
    "or",
    chalk.magenta(`npx @codiga/cli ${command}`)
  );
}

/**
 * Used to print pertinent info violation for a Rosie violation
 * @param {number} index
 * @param {object} violation
 */
export function printViolation(index, violation) {
  console.log(
    chalk.red(
      `${index}) [${violation.filename}:${violation.start.line}:${violation.start.col}]`
    )
  );
  printSubItem(` ↳ ${violation.message}`);
}

/**
 * Used to print list item or some type of sub content
 * @param {string} text
 */
export function printSubItem(text) {
  console.log(chalk.italic(text));
}
