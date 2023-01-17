import { ACTION_RULESET_ADD } from "../utils/constants";
import { executeCommand } from "./test-utils";

describe("codiga ruleset-add with parameters", () => {
  test("1 invalid, 0 valid ruleset; show proper notices", async () => {
    // run the command
    await executeCommand([ACTION_RULESET_ADD, "invalid-ruleset"]).catch(
      ({ stdout }) => {
        // check that there are notices for the invalid ruleset
        expect(stdout).toMatch(
          /The following rulesets either don't exist or you lack the permissions to access it/
        );
        expect(stdout).toMatch(/- invalid-ruleset/);
        // check that there are no notices for used rulesets
        expect(stdout).not.toMatch(
          /The following rulesets already exists in your/
        );
        // check that there are notices for valid rulesets
        expect(stdout).toMatch(/No valid rulesets were found to continue/);
      }
    );
  });

  test("1 invalid, 1 used ruleset; show proper notices", async () => {
    // run the command
    await executeCommand([
      ACTION_RULESET_ADD,
      "invalid-ruleset",
      "testing-ruleset-1",
    ]).then((stdout) => {
      // check that there are notices for the invalid ruleset
      expect(stdout).toMatch(
        /The following rulesets either don't exist or you lack the permissions to access it/
      );
      expect(stdout).toMatch(/- invalid-ruleset/);
      // check that there are notices for the used ruleset
      expect(stdout).toMatch(/The following rulesets already exists in your/);
      expect(stdout).toMatch(/- testing-ruleset-1/);
      // check that there are notices for new rulesets being added
      expect(stdout).toMatch(/We added 0 rulesets to your codiga.yml file/);
    });
  });

  test("1 invalid, 1 new ruleset; show proper notices", async () => {
    // run the command
    await executeCommand([
      ACTION_RULESET_ADD,
      "invalid-ruleset",
      "testing-ruleset-2",
    ]).then((stdout) => {
      // check that there are notices for the invalid ruleset
      expect(stdout).toMatch(
        /The following rulesets either don't exist or you lack the permissions to access it/
      );
      expect(stdout).toMatch(/- invalid-ruleset/);
      // check that there are no notices for used rulesets
      expect(stdout).not.toMatch(
        /The following rulesets already exists in your/
      );
      // check that there are notices for the new ruleset
      expect(stdout).toMatch(/We added 1 ruleset to your codiga.yml file/);
    });
  });

  test("1 used, 1 new ruleset; show proper notices", async () => {
    // run the command
    await executeCommand([
      ACTION_RULESET_ADD,
      "testing-ruleset-1",
      "testing-ruleset-2",
    ]).then((stdout) => {
      // check that there are no notices for invalid rulesets
      expect(stdout).not.toMatch(
        /The following rulesets either don't exist or you lack the permissions to access it/
      );
      // check that there are notices for the used ruleset
      expect(stdout).toMatch(/The following rulesets already exists in your/);
      expect(stdout).toMatch(/- testing-ruleset-1/);
      // check that there are notices for the new ruleset
      expect(stdout).toMatch(/We added 1 ruleset to your codiga.yml file/);
    });
  });

  test("0 used, 2 new rulesets; show proper notices", async () => {
    // run the command
    await executeCommand([
      ACTION_RULESET_ADD,
      "testing-ruleset-2",
      "testing-ruleset-3",
    ]).then((stdout) => {
      // check that there are no notices for invalid rulesets
      expect(stdout).not.toMatch(
        /The following rulesets either don't exist or you lack the permissions to access it/
      );
      // check that there are no notices for used rulesets
      expect(stdout).not.toMatch(
        /The following rulesets already exists in your/
      );
      // check that there are notices for the new rulesets
      expect(stdout).toMatch(/We added 2 rulesets to your codiga.yml file/);
    });
  });
});
