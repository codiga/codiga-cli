import fs from "fs";
import YAML from "yaml";
import { extname } from "path";
import { ROSIE_SUPPORTED_SUFFIX_TO_LANGUAGE } from "./constants";
import { printFailure } from "./print";

/**
 * read a file contents
 * @param {string} path
 * @returns
 */
export function readFile(path) {
  try {
    const file = fs.readFileSync(path, "utf8");
    return file;
  } catch (err) {
    printFailure(`Unable to read file: ${path}`);
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
    printFailure(`Unable to parse YAML file${path ? `: ${path}` : ""}`);
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
