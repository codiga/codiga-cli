import { buildRulesetsQuery } from "../utils/graphql";

test("check that we can build single ruleset queries", () => {
  const { query, aliasMap } = buildRulesetsQuery(["test-ruleset"]);

  expect(query).toEqual(
    "query getRulesets {" +
      'test_ruleset: ruleSet(name: "test-ruleset") { id }' +
      "}"
  );
  expect(aliasMap).toEqual({
    test_ruleset: "test-ruleset",
  });
});

test("check that we can build multiple ruleset queries", () => {
  const { query, aliasMap } = buildRulesetsQuery([
    "test-ruleset",
    "second-ruleset",
  ]);

  expect(query).toEqual(
    "query getRulesets {" +
      'test_ruleset: ruleSet(name: "test-ruleset") { id }' +
      'second_ruleset: ruleSet(name: "second-ruleset") { id }' +
      "}"
  );
  expect(aliasMap).toEqual({
    test_ruleset: "test-ruleset",
    second_ruleset: "second-ruleset",
  });
});
