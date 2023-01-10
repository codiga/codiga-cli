import Conf from "conf";
import { isTestMode } from "../tests/test-utils";
import { STORE_API_TOKEN } from "./constants";

/**
 * Get a store instance
 * For testing, we'll get a temporary folder
 */
export const store = new Conf({
  projectSuffix: isTestMode ? "testing" : "",
});

/**
 * Saves an API token for a user
 * @param {string} token
 */
export function setToken(token) {
  store.set(STORE_API_TOKEN, token);
}

/**
 * Gets an API token for a user
 * @returns {string?} api token
 */
export function getToken() {
  return store.get(STORE_API_TOKEN, null);
}

/**
 * Remove an API token for a user
 */
export function deleteToken() {
  store.delete(STORE_API_TOKEN);
}
