/**
 * encode a string as base64
 * @param {string} str
 */
export function encodeToBase64(str) {
  return Buffer.from(str, "utf8").toString("base64");
}

/**
 * decode a base64 string
 * @param {string} str
 * @returns
 */
export function decodeFromBase64(str) {
  return Buffer.from(str, "base64").toString("utf8");
}
