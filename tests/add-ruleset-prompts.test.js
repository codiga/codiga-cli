import {
  CATEGORY_CHOICES,
  CATEGORY_PYTHON_GENERAL_VALUE,
  RULESET_CHOICES,
} from "../utils/constants";

jest.mock("inquirer");
const { prompt, expectPrompts } = require("inquirer");

describe("`codiga ruleset-add` interactive prompts", () => {
  test("invalid category", async () => {
    // what does the category prompt expect
    expectPrompts([
      {
        type: "list",
        name: "category",
        pageSize: CATEGORY_CHOICES.length,
        message: "Please select one category:",
        choices: CATEGORY_CHOICES,
        choose: "invalid-category",
      },
    ]);

    // mock the prompt with our real world setup
    const { category } = await prompt([
      {
        type: "list",
        name: "category",
        pageSize: CATEGORY_CHOICES.length,
        message: "Please select one category:",
        choices: CATEGORY_CHOICES,
      },
    ]);

    expect(category).toEqual(undefined);
  });

  test("valid category; invalid rulesets", async () => {
    // what does the category prompt expect
    expectPrompts([
      {
        type: "list",
        name: "category",
        pageSize: CATEGORY_CHOICES.length,
        message: "Please select one category:",
        choices: CATEGORY_CHOICES,
        choose: CATEGORY_PYTHON_GENERAL_VALUE,
      },
    ]);

    // mock the prompt with our real world setup
    const { category } = await prompt([
      {
        type: "list",
        name: "category",
        pageSize: CATEGORY_CHOICES.length,
        message: "Please select one category:",
        choices: CATEGORY_CHOICES,
      },
    ]);

    // ensure the category is correct
    expect(category).toEqual(CATEGORY_PYTHON_GENERAL_VALUE);

    // what does the rulesets prompt expect
    expectPrompts([
      {
        type: "checkbox",
        name: "rulesets",
        message: "Please select all the rulesets you'd like to add",
        choices: RULESET_CHOICES[category].map((ruleset) => ({
          type: "checkbox",
          name: ruleset,
        })),
        check: ["invalid-ruleset", "also-invalid"],
      },
    ]);

    // mock the prompt with our real world setup
    const { rulesets } = await prompt([
      {
        type: "checkbox",
        name: "rulesets",
        message: "Please select all the rulesets you'd like to add",
        choices: RULESET_CHOICES[category].map((ruleset) => ({
          type: "checkbox",
          name: ruleset,
        })),
      },
    ]);

    // ensure we receive no rulesets
    expect(rulesets.length).toBe(0);
  });

  test("valid category; valid rulesets", async () => {
    // what does the category prompt expect
    expectPrompts([
      {
        type: "list",
        name: "category",
        pageSize: CATEGORY_CHOICES.length,
        message: "Please select one category:",
        choices: CATEGORY_CHOICES,
        choose: CATEGORY_PYTHON_GENERAL_VALUE,
      },
    ]);

    // mock the prompt with our real world setup
    const { category } = await prompt([
      {
        type: "list",
        name: "category",
        pageSize: CATEGORY_CHOICES.length,
        message: "Please select one category:",
        choices: CATEGORY_CHOICES,
      },
    ]);

    // ensure the category is correct
    expect(category).toEqual(CATEGORY_PYTHON_GENERAL_VALUE);

    // what does the rulesets prompt expect
    expectPrompts([
      {
        type: "checkbox",
        name: "rulesets",
        message: "Please select all the rulesets you'd like to add",
        choices: RULESET_CHOICES[category].map((ruleset) => ({
          type: "checkbox",
          name: ruleset,
        })),
        check: ["python-security"],
      },
    ]);

    // mock the prompt with our real world setup
    const { rulesets } = await prompt([
      {
        type: "checkbox",
        name: "rulesets",
        message: "Please select all the rulesets you'd like to add",
        choices: RULESET_CHOICES[category].map((ruleset) => ({
          type: "checkbox",
          name: ruleset,
        })),
      },
    ]);

    // ensure the category is correct
    expect(rulesets.length).toBe(1);
    expect(rulesets).toContain("python-security");
  });
});
