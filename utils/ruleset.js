import { GET_RULESET } from "../graphql/queries";
import { getRulesetMock } from "../tests/fixtures/rulesetMock";
import { isTestMode } from "../tests/test-utils";
import { codigaApiFetch } from "./api";

export async function getRuleset({ name }) {
  try {
    if (isTestMode) return getRulesetMock(name);
    const resp = await codigaApiFetch(GET_RULESET, { name });
    return resp.ruleSet;
  } catch (err) {
    return null;
  }
}

export function convertRulesetsToString(rulesets) {
  return `rulesets:\n${rulesets
    .filter((x) => x)
    .map((ruleset) => `  - ${ruleset}\n`)
    .join("")}`;
}
