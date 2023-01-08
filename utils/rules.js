import {
  ELEMENT_CHECKED_TO_ENTITY_CHECKED,
  LANGUAGE_JAVASCRIPT,
  LANGUAGE_TYPESCRIPT,
} from "./constants";
import "../types/Rosie";

/**
 * Converts an array of rulesets into one array of
 * @param {RosieGraphqlRuleset[]} rulesets
 */
export function convertRulesetsToRules(rulesets) {
  if (!rulesets) return [];

  let rules = [];

  rulesets.forEach((ruleset) => {
    const rulesetName = ruleset.name;

    ruleset.rules.forEach((rulesetRule) => {
      const entityChecked =
        rulesetRule.ruleType === "Ast"
          ? ELEMENT_CHECKED_TO_ENTITY_CHECKED.get(rulesetRule.elementChecked)
          : null;

      const rule = {
        id: `${rulesetName}/${rulesetRule.name}`,
        contentBase64: rulesetRule.content,
        language: rulesetRule.language.toLowerCase(),
        type: rulesetRule.ruleType.toLowerCase(),
        entityChecked: entityChecked,
        pattern: rulesetRule.pattern,
      };

      rules.push(rule);
    });
  });

  return rules;
}

/**
 * Gets an array of rules filtered by languages
 * @param {RosieRule[]} rules
 * @param {string} language
 */
export function getRulesForRosiePerLanguage(rules, language) {
  // our rosie rules have lowercased languages
  const lowercasedLanguage = language.toLowerCase();

  // for typescript files, we send JS and TS rules
  if (language === LANGUAGE_TYPESCRIPT) {
    const lowercasedLanguages = [LANGUAGE_TYPESCRIPT, LANGUAGE_JAVASCRIPT].map(
      (l) => l.toLowerCase()
    );
    return rules.filter((rule) => lowercasedLanguages.includes(rule.language));
  }

  // otherwise, just send the language rules
  return rules.filter((rule) => rule.language === lowercasedLanguage);
}
