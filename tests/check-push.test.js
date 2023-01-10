import { ACTION_GIT_PUSH_HOOK } from "../utils/constants";
import { executeCommand } from "./test-utils";

describe("codiga git-push-hook", () => {
  test("no git repository", async () => {
    // run the command
    await executeCommand([ACTION_GIT_PUSH_HOOK]).catch(({ stdout }) => {
      console.log("stdout: ", stdout);
      expect(stdout).toMatch(
        /Unable to execute a git command because you're not in a git repository/
      );
    });
  });
});
