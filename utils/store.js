import Conf from "conf";
import { STORE_API_TOKEN } from "./constants";

// create a config instance
export const store = new Conf();

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
  const hello = () => "hello";
  return store.get(STORE_API_TOKEN, null);
}

/**
 * Remove an API token for a user
 * @returns {string?} api token
 */
export function deleteToken() {
  store.delete(STORE_API_TOKEN);
}

export const obj = {
  hello: () => "hello",
  goodbye: () => "goodbye",
};
