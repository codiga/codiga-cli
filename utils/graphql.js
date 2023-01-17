import { gql } from "graphql-request";

/**
 * Converts any dashes(-) to underscores(_) as Graphql
 * doesn't allow dashes to be used in aliases
 * @param {string} name
 * @returns a graphql acceptable alias string
 */
function getQueryAlias(name) {
  return name.replace(/-/g, "_");
}

/**
 * Converts an array of name strings into a valid graphql query string
 * ex) example_1: ruleSet(name: "example-1") { id }
 * @param {string[]} names
 * @returns
 */
function getQueries(names) {
  return names
    .map((name) => `${getQueryAlias(name)}: ruleSet(name: "${name}") { id }`)
    .join("");
}

/**
 * Used to build multiple `ruleSet` queries into one query string
 * while returning an alias to name mapper to read the queries
 * @param {string[]} names ruleset names
 * @returns {{query: string, aliasMap: {string: string}}}
 */
export function buildRulesetsQuery(names) {
  const uniqueNames = [...new Set(names)];

  const query = gql`query getRulesets {${getQueries(uniqueNames)}}`;

  const aliasMap = names.reduce(
    (acc, cur) => ({ ...acc, [getQueryAlias(cur)]: cur }),
    {}
  );

  return { query, aliasMap };
}
