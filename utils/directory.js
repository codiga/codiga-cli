import { promises as Fs } from "fs";
import path from "path";
import { globby } from "globby";

/**
 * Find out if a path (that exists) is a file or directory
 * @param {string} path
 * @returns {Promise<boolean | null>} if the path was not found, we return null
 */
export async function getIsDirectory(path) {
  try {
    const stats = await Fs.stat(path);
    return stats.isDirectory();
  } catch (err) {
    return null;
  }
}

/**
 * Get all the files in a directory, if it exists
 * @param {string} dir
 * @param {boolean | null} followSymlinks
 * @returns {Promise<string[] | null>} returns null if the directory doesn't exist
 */
export async function getAllDirectoryFiles(dir, followSymlinks) {
  try {
    const files = await globby(path.resolve(dir), {
      gitignore: true,
      followSymbolicLinks: !!followSymlinks,
      absolute: false,
    });
    return files;
  } catch (err) {
    console.log(err);
    return null;
  }
}
