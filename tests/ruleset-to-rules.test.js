import { convertRulesetsToRules } from "../utils/rules";
import { getRulesetsWithRulesMock } from "./fixtures/rulesetsMock";

test("can fetch rulesets when an API token is set", async () => {
  expect(
    convertRulesetsToRules(
      getRulesetsWithRulesMock(["testing-ruleset-1", "testing-ruleset-2"])
    )
  ).toEqual([
    {
      id: "testing-ruleset-1/testing-rule-11",
      contentBase64:
        "ZnVuY3Rpb24gdmlzaXQobm9kZSl7CiAgaWYoIW5vZGUpIHJldHVybiAKfQ==",
      language: "javascript",
      type: "ast",
      entityChecked: "htmlelement",
      pattern: null,
    },
    {
      id: "testing-ruleset-2/testing-rule-22",
      contentBase64:
        "ZnVuY3Rpb24gdmlzaXQobm9kZSl7CiAgaWYoIW5vZGUpIHJldHVybiAKfQ==",
      language: "javascript",
      type: "ast",
      entityChecked: "assign",
      pattern: null,
    },
  ]);

  expect(
    convertRulesetsToRules(
      getRulesetsWithRulesMock(["testing-ruleset-1", "testing-ruleset-3"])
    )
  ).toEqual([
    {
      id: "testing-ruleset-1/testing-rule-11",
      contentBase64:
        "ZnVuY3Rpb24gdmlzaXQobm9kZSl7CiAgaWYoIW5vZGUpIHJldHVybiAKfQ==",
      language: "javascript",
      type: "ast",
      entityChecked: "htmlelement",
      pattern: null,
    },
  ]);

  expect(
    convertRulesetsToRules(getRulesetsWithRulesMock(["testing-ruleset-3"]))
  ).toEqual([]);
});
