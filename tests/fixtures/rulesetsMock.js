export function getRulesetsWithRulesMock(rulesets) {
  return mockedRulesets.filter((ruleset) => rulesets.includes(ruleset.name));
}

export const mockedRulesets = [
  {
    id: 1,
    name: "testing-ruleset-1",
    rules: [
      {
        id: 11,
        name: "testing-rule-11",
        content: "ZnVuY3Rpb24gdmlzaXQobm9kZSl7CiAgaWYoIW5vZGUpIHJldHVybiAKfQ==",
        ruleType: "Ast",
        language: "Javascript",
        pattern: null,
        elementChecked: "HtmlElement",
      },
    ],
  },
  {
    id: 2,
    name: "testing-ruleset-2",
    rules: [
      {
        id: 12,
        name: "testing-rule-22",
        content: "ZnVuY3Rpb24gdmlzaXQobm9kZSl7CiAgaWYoIW5vZGUpIHJldHVybiAKfQ==",
        ruleType: "Ast",
        language: "Javascript",
        pattern: null,
        elementChecked: "Assignment",
      },
    ],
  },
  {
    id: 3,
    name: "testing-ruleset-3",
    rules: [],
  },
];
