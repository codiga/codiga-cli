import fetch from "node-fetch";
import {
  GRAPHQL_STAGING_URL,
  // GRAPHQL_PROD_URL,
  ROSIE_URL,
  API_TOKEN_HEADER,
  USER_AGENT_CLI,
  USER_AGENT_HEADER,
} from "./constants";
import { request } from "graphql-request";
import { getToken } from "./store";
import { printError } from "./print";

/**
 * Run a query against the Codiga Graphql API
 * @param {string} query - gql document query
 * @param {object?} variables - variables needed to run the query
 * @param {string?} apiToken - a user's apiToken
 * @returns the result of the query or an error
 */
export async function codigaApiFetch(query, variables = null, apiToken = null) {
  // create the request headers
  const requestHeaders = {
    [API_TOKEN_HEADER]: apiToken || getToken(),
    [USER_AGENT_HEADER]: USER_AGENT_CLI,
  };
  // run the request against the Codiga API
  return await request({
    url: GRAPHQL_STAGING_URL,
    document: query,
    variables,
    requestHeaders,
  });
}

/**
 * Run a fetch to the Rosie API
 * @param {object} body an unserialized object
 */
export async function rosieApiFetch(body) {
  try {
    const resp = await fetch(ROSIE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!data || !data.ruleResponses) {
      return [];
    }
    return data.ruleResponses;
  } catch (err) {
    // console.debug(err);
    return [];
  }
}
