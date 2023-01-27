import fs from "fs";
import YAML from "yaml";
import { extname } from "path";
import { ROSIE_SUPPORTED_SUFFIX_TO_LANGUAGE } from "./constants";
import {
  printEmptyLine,
  printFailure,
  printSuggestion,
  setPrintToStdErr,
  setPrintToStdOut,
} from "./print";

/**
 * Used to read a file
 * If the file doesn't exist, we'll return null
 * @param {string} path
 * @returns
 */
export function readFile(path) {
  try {
    return fs.readFileSync(path, "utf8");
  } catch (err) {
    return null;
  }
}

/**
 * Used to read a file
 * If the file doesn't exist, we'll exit
 * @param {string} path
 * @returns
 */
export function readFileRequired(path) {
  try {
    const file = fs.readFileSync(path, "utf8");
    return file;
  } catch (err) {
    setPrintToStdErr();
    printEmptyLine();
    printFailure(`Unable to read file: ${path}`);
    printSuggestion(
      " ↳ Please try again and contact us, if the issue persists:",
      "https://app.codiga.io/support"
    );
    printEmptyLine();
    setPrintToStdOut();
    process.exit(1);
  }
}

/**
 * Get the content of a YAML file
 * @param {string} content
 * @param {string} path (optional)
 */
export function parseYamlFile(content, path) {
  try {
    const parsedFile = YAML.parse(content);
    return parsedFile;
  } catch (err) {
    setPrintToStdErr();
    printEmptyLine();
    printFailure(`Unable to parse YAML file${path ? `: ${path}` : ""}`);
    console.log(" ↳ Ensure your file is valid YAML syntax.");
    printSuggestion(
      " ↳ You can can use this online parser to check where your errors reside:",
      "https://jsonformatter.org/yaml-parser"
    );
    printEmptyLine();
    setPrintToStdOut();
    process.exit(1);
  }
}

/**
 * Take a filename and converts it to Rosie supported language, if possible
 * @param {string} filename
 * @returns the language of the file, IF Rosie supports it
 */
export function getLanguageForFile(filename) {
  const extension = extname(filename);
  const language = ROSIE_SUPPORTED_SUFFIX_TO_LANGUAGE.get(extension);
  return language;
}
