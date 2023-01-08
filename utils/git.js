import child_process from "child_process";
import { printError } from "./print";

/**
 * Executes a git command with the given args in that order
 * @param {string[]} args
 */
export function executeGitCommand(args) {
  try {
    const resp = child_process.execSync(`git ${args.join(" ")}`, {
      encoding: "utf8",
    });
    return resp;
  } catch (err) {
    // console.debug(err)
    return null;
    // printError("unable to execute a git command", "003");
    // process.exit(2);
  }
}

/**
 * Gets the git directory
 * @returns the directory string or exits if there isn't one
 */
export function getRootDirectory() {
  const rootDirectory = executeGitCommand(["rev-parse", "--show-toplevel"]);
  if (rootDirectory) {
    return rootDirectory.split("\n").join("");
  } else {
    printError("unable to execute a git command", "003");
    process.exit(1);
  }
}

/**
 * Gets the current git branch
 * @returns {string?} branch
 */
export function getCurrentBranch() {
  const currentBranch = executeGitCommand([
    "rev-parse",
    "--abbrev-ref",
    "HEAD",
  ]);
  if (currentBranch) {
    return currentBranch.split("\n").join("");
  } else {
    return null;
  }
}

/**
 * Gets the HEAD git branch
 * @returns {string?} branch
 */
export function getMainBranch() {
  const output = executeGitCommand(["remote", "show", "origin"]);
  let branch = null;
  if (output) {
    const splitOutput = output.split("\n");
    for (let i = 0; i < splitOutput.length; i++) {
      const line = splitOutput[i].replace(/\n/g, "");
      // we've found our targeted branch
      if (line.includes("HEAD branch:")) {
        // extract the branch name now
        const temp = line.split(":").map((x) => x.trim());
        branch = temp.length > 0 ? temp[1] : null;
        break;
      }
    }
  }
  return branch;
}

export function findClosestSha() {
  const currentBranch = getCurrentBranch();
  const mainBranch = getMainBranch();
  let closestSha = null;

  if (!currentBranch || !mainBranch) {
    console.debug("cannot find the closest SHA (issue when finding branches)");
    return null;
  }

  const output = executeGitCommand([
    "merge-base",
    "-a",
    mainBranch,
    currentBranch,
  ]);

  if (output) {
    closestSha = output.replace(/\n/g, "").trim();
    console.debug(
      `Closest SHA found between ${currentBranch} and ${mainBranch}: ${closestSha}`
    );
  }

  return closestSha;
}
