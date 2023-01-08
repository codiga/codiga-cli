/**
 * This is the structure of a rule that we send to Rosie
 * @typedef {object} RosieRule
 * @property {string} id
 * @property {string} content_base64
 * @property {string} language
 * @property {"ast" | "pattern"} rule_type
 * @property {string?} entity_checked
 * @property {string?} pattern
 */

/**
 * This is the structure of a rule that we receive from the Codiga API
 * @typedef {object} RosieGraphqlRule
 * @property {number} id
 * @property {string} name
 * @property {string} content
 * @property {string} language
 * @property {"ast" | "pattern"} ruleType
 * @property {string?} elementChecked
 * @property {string?} pattern
 */

/**
 * This is the structure of a ruleset that we receive from the Codiga API
 * @typedef {object} RosieGraphqlRuleset
 * @property {number} id
 * @property {string} name
 * @property {RosieGraphqlRule[]} rules
 */
