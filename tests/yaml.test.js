import { parseYamlFile } from "../utils/file";
import { convertRulesetsToString } from "../utils/ruleset";
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

test("ruleset is converted correctly", () => {
  const input = ["codiga-ruleset"];
  const output = "rulesets:\n" + "  - codiga-ruleset\n";
  expect(convertRulesetsToString(input)).toBe(output);
});

test("empty strings are removed", () => {
  const input = ["codiga-ruleset", "", "daniel-ruleset"];
  const output =
    "rulesets:\n" + "  - codiga-ruleset\n" + "  - daniel-ruleset\n";
  expect(convertRulesetsToString(input)).toBe(output);
});

test("null values are removed", () => {
  const input = ["codiga-ruleset", "", null];
  const output = "rulesets:\n" + "  - codiga-ruleset\n";
  expect(convertRulesetsToString(input)).toBe(output);
});

test("undefined values are removed", () => {
  const input = ["codiga-ruleset", "", undefined];
  const output = "rulesets:\n" + "  - codiga-ruleset\n";
  expect(convertRulesetsToString(input)).toBe(output);
});
