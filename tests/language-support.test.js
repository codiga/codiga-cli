import {
  LANGUAGE_JAVASCRIPT,
  LANGUAGE_PYTHON,
  LANGUAGE_TYPESCRIPT,
} from "../utils/constants";
import { managePathsBySupportAndLanguage } from "../utils/rosie";

const notSupportedPaths = [
  "config.json",
  "README.md",
  "LICENSE",
  "index.html",
  "picture.png",
];

const pythonPaths = [
  "index.py3",
  "/python.py3",
  "/some-folder/nested/index.py",
];

const javascriptPaths = [
  "index.js",
  "/javascript.jsx",
  "/some-folder/nested/index.js",
];

const typescriptPaths = [
  "index.ts",
  "/typescript.tsx",
  "/some-folder/nested/index.ts",
];

test("path files are split correctly", async () => {
  const files = managePathsBySupportAndLanguage([
    ...notSupportedPaths,
    ...pythonPaths,
    ...javascriptPaths,
    ...typescriptPaths,
  ]);

  expect(files.notSupported.length).toBe(5);
  expect(files[LANGUAGE_PYTHON].length).toBe(3);
  expect(files[LANGUAGE_JAVASCRIPT].length).toBe(3);
  expect(files[LANGUAGE_TYPESCRIPT].length).toBe(3);
});
