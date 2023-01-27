import { formatAnalysis } from "../utils/output";
import {
  violationsMock,
  violationsText,
  violationsJson,
  violationsCsv,
} from "./fixtures/violationsMock";

describe("output.test.js", () => {
  test("should check text format", async () => {
    const content = await formatAnalysis(violationsMock, "text");
    expect(content).toBe(violationsText);
  });

  test("should check json format", async () => {
    const content = await formatAnalysis(violationsMock, "json");
    expect(content).toBe(violationsJson);
  });

  test("should check csv format", async () => {
    const content = await formatAnalysis(violationsMock, "csv");
    expect(content).toBe(violationsCsv);
  });
});
