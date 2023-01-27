import { handleAnswers } from "../src/codigaToken";
import {
  ACTION_TOKEN_ADD,
  ACTION_TOKEN_CHECK,
  ACTION_TOKEN_DELETE,
} from "../utils/constants";
import { setToken, store } from "../utils/store";
import { executeCommand, deleteFile, SAMPLE_TOKEN } from "./test-utils";

jest.mock("inquirer");
const { prompt, expectPrompts } = require("inquirer");

function setup() {
  beforeEach(() => {
    // delete our testing config file before starting
    deleteFile(store.path);
    // suppress logs
    // global.console = {
    //   log: jest.fn(),
    // };
  });
  afterEach(() => {
    global.console = {
      log: console.log,
    };
  });
}

test("ensure we're using a temp store folder", () => {
  expect(store.path).toMatch(/cli-testing/);
});

describe("codiga token-add", () => {
  setup();

  test("first notice shows", async () => {
    // run the command
    await executeCommand([ACTION_TOKEN_ADD]).catch(({ stdout }) => {
      expect(stdout).toMatch(/Create a Codiga API token/);
    });
  });

  test("can set a valid token", async () => {
    // specify expected prompts and corresponding actions
    // before making the prompt
    expectPrompts([
      {
        type: "input",
        name: "apiToken",
        message: "Please enter your API token:",
        input: SAMPLE_TOKEN,
      },
    ]);

    // then just use inquirer as normal.
    // if a imported mdoule uses inquirer, it's also using the mocked version.
    const answers = await prompt([
      {
        type: "input",
        name: "apiToken",
        message: "Please enter your API token:",
      },
    ]);

    expect(answers).toEqual({
      apiToken: SAMPLE_TOKEN,
    });

    // this will set our token
    await handleAnswers(answers);

    // run the command
    await executeCommand([ACTION_TOKEN_CHECK]).then((stdout) => {
      console.log("stdout: ", stdout);
      expect(stdout).toMatch(/A valid API token was found for/);
    });
  });

  test("can't set an invalid token", async () => {
    // specify expected prompts and corresponding actions
    // before making the prompt
    expectPrompts([
      {
        type: "input",
        name: "apiToken",
        message: "Please enter your API token:",
        input: "bad-token",
      },
    ]);

    // then just use inquirer as normal.
    // if a imported mdoule uses inquirer, it's also using the mocked version.
    const answers = await prompt([
      {
        type: "input",
        name: "apiToken",
        message: "Please enter your API token:",
      },
    ]);

    expect(answers).toEqual({
      apiToken: "bad-token",
    });

    // this will set our token
    await handleAnswers(answers);

    // run the command
    await executeCommand([ACTION_TOKEN_CHECK]).catch(({ stderr }) => {
      expect(stderr).toMatch(/No token was found/);
    });
  });
});

describe("codiga token-check", () => {
  setup();

  test("no token", async () => {
    // run the command
    await executeCommand([ACTION_TOKEN_CHECK]).catch(({ stderr }) => {
      expect(stderr).toMatch(/No token was found/);
    });
  });

  test("invalid token", async () => {
    // set an invalid token
    setToken("bad-token");

    // run the command
    await executeCommand([ACTION_TOKEN_CHECK]).catch(({ stderr }) => {
      expect(stderr).toMatch(/An invalid token was found/);
    });
  });

  test("valid token", async () => {
    // set an valid token
    setToken(SAMPLE_TOKEN);

    // run the command
    await executeCommand([ACTION_TOKEN_CHECK]).then((stdout) => {
      expect(stdout).toMatch(/A valid API token was found for/);
    });
  });
});

describe("codiga token-delete", () => {
  setup();

  test("no token found", async () => {
    // run the command
    await executeCommand([ACTION_TOKEN_DELETE]).catch(({ stderr }) => {
      expect(stderr).toMatch(/No Codiga API token was found to delete/);
    });
  });

  test("token removed", async () => {
    // create token
    setToken(SAMPLE_TOKEN);

    // run the command
    await executeCommand([ACTION_TOKEN_DELETE]).then((output) => {
      expect(output).toMatch(/Codiga API token deleted/);
    });
  });
});
