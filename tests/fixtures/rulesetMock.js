export const mockedRuleset1 = {
  id: 1,
  name: "test-ruleset",
};

export const mockedRuleset2 = {
  id: 2,
  name: "great-ruleset",
};

export const mockedRuleset3 = {
  id: 3,
  name: "fantastic-ruleset",
};

export function getRulesetMock(rulesetName) {
  switch (rulesetName) {
    case "test-ruleset":
      return mockedRuleset1;
    case "great-ruleset":
      return mockedRuleset2;
    case "fantastic-ruleset":
      return mockedRuleset3;
    default:
      return null;
  }
}
