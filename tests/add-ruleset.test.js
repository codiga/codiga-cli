import { ACTION_RULESET_ADD } from "../utils/constants";
import { executeCommand } from "./test-utils";

describe("codiga ruleset-add", () => {
  test("an invalid ruleset name should throw", async () => {
    // run the command
    await executeCommand([ACTION_RULESET_ADD, "invalid-ruleset"])
      .then((output) => {
        expect(output).toBeUndefined();
      })
      .catch(({ stdout }) => {
        expect(stdout).toMatch(
          /That ruleset either doesn't exist or you lack the permissions to access it/
        );
      });
  });

  test("a ruleset that's already present should throw", async () => {
    // run the command
    await executeCommand([ACTION_RULESET_ADD, "great-ruleset"])
      .then((output) => {
        expect(output).toBeUndefined();
      })
      .catch(({ stdout }) => {
        console.log(stdout);
        expect(stdout).toMatch(/already exists in your/);
      });
  });
});
