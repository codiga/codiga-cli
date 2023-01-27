import { ACTION_GIT_PUSH_HOOK, BLANK_SHA } from "../utils/constants";
import { executeCommand } from "./test-utils";

describe("codiga git-push-hook", () => {
  test("check for same SHAs", async () => {
    // run the command
    await executeCommand([
      ACTION_GIT_PUSH_HOOK,
      "--remote-sha",
      "1234",
      "--local-sha",
      "1234",
    ]).then((output) => {
      expect(output).toMatch(/Remote and local SHA are the same/);
    });
  });

  test("check for closest SHA", async () => {
    // run the command
    await executeCommand([
      ACTION_GIT_PUSH_HOOK,
      "--remote-sha",
      BLANK_SHA,
      "--local-sha",
      "5678",
    ]).then((output) => {
      expect(output).toMatch(
        /Tried to find closest SHA but did not find any; exiting with code 0/
      );
    });
  });

  test("unable to fetch rulesets when no API token is set", async () => {
    // run the command
    await executeCommand([
      ACTION_GIT_PUSH_HOOK,
      "--remote-sha",
      "1234",
      "--local-sha",
      "5678",
    ]).catch(({ stderr }) => {
      expect(stderr).toMatch(/We were unable to fetch your rulesets/);
    });
  });
});
