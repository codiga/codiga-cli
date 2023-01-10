import { parseYamlFile } from "../utils/file";
import {
  CODIGA_CONFIG_MISSING_RULESETS,
  CODIGA_CONFIG_MISSING_RULESETS_LIST,
  CODIGA_CONFIG_MISSING_RULESETS_VALID,
} from "./test-utils";

test("parse missing `rulesets:` correctly", async () => {
  expect(parseYamlFile(CODIGA_CONFIG_MISSING_RULESETS)).toBe(null);
});

test("parse missing rulesets list correctly", async () => {
  expect(parseYamlFile(CODIGA_CONFIG_MISSING_RULESETS_LIST)).toEqual({
    rulesets: null,
  });
});

test("parse a valid file accurately", async () => {
  expect(parseYamlFile(CODIGA_CONFIG_MISSING_RULESETS_VALID)).toEqual({
    rulesets: ["react-best-practices", "jsx-a11y"],
  });
});
