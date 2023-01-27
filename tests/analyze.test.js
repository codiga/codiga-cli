import { ACTION_ANALYZE } from "../utils/constants";
import { executeCommand } from "./test-utils";

describe("codiga analyze", () => {
  test("should catch an invalid directory", async () => {
    // run the command
    await executeCommand([ACTION_ANALYZE, "invalid-directory"]).catch(
      ({ stderr }) => {
        expect(stderr).toMatch(/No such file or directory to analyze/);
      }
    );
  });

  test("should catch when a file is specified without rulesets", async () => {
    // run the command
    await executeCommand([ACTION_ANALYZE, "tests/test-utils.js"]).catch(
      ({ stderr }) => {
        expect(stderr).toMatch(/No rulesets were given to analyze this file/);
      }
    );
  });

  test("1 invalid ruleset; 0 valid ruleset; should catch error", async () => {
    // run the command
    await executeCommand([
      ACTION_ANALYZE,
      "tests/test-utils.js",
      "--ruleset invalid-ruleset",
    ]).catch(({ stderr }) => {
      expect(stderr).toMatch(/No valid rulesets were found to continue/);
    });
  });

  test("1 invalid ruleset; 1 valid ruleset; should have invalid notice", async () => {
    // run the command
    await executeCommand([
      ACTION_ANALYZE,
      "tests/test-utils.js",
      "--ruleset invalid-ruleset",
      "--ruleset testing-ruleset-1",
    ]).catch(({ stdout }) => {
      expect(stdout).toMatch(
        /The following rulesets either don't exist or you lack the permissions to access it/
      );
      expect(stdout).toMatch(/- invalid-ruleset/);
    });
  });
});
