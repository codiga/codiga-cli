import fs from "fs";
import child_process from "child_process";
// import { printFailure } from "../utils/print";

export const isTestMode = process.env.NODE_ENV === "test";

export const SAMPLE_TOKEN = "0000-some-fake-token-4444-5555";

export const TEST_USER = {
  id: 7,
  username: "tester",
  accountType: "Github",
};

export const CODIGA_CONFIG_MISSING_RULESETS = `
`;

export const CODIGA_CONFIG_MISSING_RULESETS_LIST = `
rulesets:
`;

export const CODIGA_CONFIG_MISSING_RULESETS_VALID = `
rulesets:
  - react-best-practices
  - jsx-a11y
`;

export const executeCommand = async (args) => {
  try {
    return child_process.execSync(`codiga ${args.join(" ")}`, {
      encoding: "utf8",
    });
  } catch (err) {
    throw err;
  }
};

export function readFile(path) {
  try {
    const file = fs.readFileSync(path, "utf8");
    return file;
  } catch (err) {
    // printFailure(`Unable to read file: ${path}`);
  }
}

export async function deleteFile(path) {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    // printFailure(`Cannot delete a file that doesn't exist: ${path}`);
  }
}
