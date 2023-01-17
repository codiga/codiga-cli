import pkg from "../package.json";
const { version } = pkg;

// COMMAND ACTIONS
export const ACTION_TOKEN_ADD = "token-add";
export const ACTION_TOKEN_CHECK = "token-check";
export const ACTION_TOKEN_DELETE = "token-delete";
export const ACTION_GIT_PUSH_HOOK = "git-push-hook";
export const ACTION_RULESET_ADD = "ruleset-add";

// COMMAND OPTIONS
export const OPTION_LANGUAGE = "language";
export const OPTION_REMOTE_SHA = "remote-sha";
export const OPTION_LOCAL_SHA = "local-sha";

// URLs
export const GRAPHQL_STAGING_URL = "https://api-staging.codiga.io/graphql";
export const GRAPHQL_PROD_URL = "https://api.codiga.io/graphql";
export const ROSIE_URL = "https://analysis.codiga.io/analyze";

// CODIGA API
export const API_TOKEN_HEADER = "X-Api-Token";
export const USER_AGENT_HEADER = "User-Agent";
export const USER_AGENT_CLI = `Cli/${version}`;

// `ruleset-add` PROMPTS
// PYTHON
export const CATEGORY_PYTHON_GENERAL_NAME = "Python (general)";
export const CATEGORY_PYTHON_GENERAL_VALUE = "python-general";
export const CATEGORY_PYTHON_FLASK_NAME = "Python (Flask)";
export const CATEGORY_PYTHON_FLASK_VALUE = "python-flask";
// JAVASCRIPT
export const CATEGORY_JS_GENERAL_NAME = "Javascript (general)";
export const CATEGORY_JS_GENERAL_VALUE = "javascript-general";
export const CATEGORY_JS_REACT_NAME = "Javascript (React)";
export const CATEGORY_JS_REACT_VALUE = "javascript-react";
export const CATEGORY_JS_EXPRESS_NAME = "Javascript (Express)";
export const CATEGORY_JS_EXPRESS_VALUE = "javascript-express";
export const CATEGORY_JS_TESTING_NAME = "Javascript (testing)";
export const CATEGORY_JS_TESTING_VALUE = "javascript-testing";
export const CATEGORY_JS_APOLLO_GRAPHQL_NAME = "Javascript (Apollo GraphQL)";
export const CATEGORY_JS_APOLLO_GRAPHQL_VALUE = "javascript-apollo-graphql";
// TYPESCRIPT
export const CATEGORY_TS_GENERAL_NAME = "Typescript (general)";
export const CATEGORY_TS_GENERAL_VALUE = "typescript-general";
export const CATEGORY_TS_TESTING_NAME = "Typescript (testing)";
export const CATEGORY_TS_TESTING_VALUE = "typescript-testing";
export const CATEGORY_TS_APOLLO_GRAPHQL_NAME = "Typescript (Apollo GraphQL)";
export const CATEGORY_TS_APOLLO_GRAPHQL_VALUE = "typescript-apollo-graphql";

export const CATEGORY_CHOICES = [
  {
    name: CATEGORY_PYTHON_GENERAL_NAME,
    value: CATEGORY_PYTHON_GENERAL_VALUE,
  },
  {
    name: CATEGORY_PYTHON_FLASK_NAME,
    value: CATEGORY_PYTHON_FLASK_VALUE,
  },
  {
    name: CATEGORY_JS_GENERAL_NAME,
    value: CATEGORY_JS_GENERAL_VALUE,
  },
  {
    name: CATEGORY_JS_TESTING_NAME,
    value: CATEGORY_JS_TESTING_VALUE,
  },
  {
    name: CATEGORY_JS_REACT_NAME,
    value: CATEGORY_JS_REACT_VALUE,
  },
  {
    name: CATEGORY_JS_EXPRESS_NAME,
    value: CATEGORY_JS_EXPRESS_VALUE,
  },
  {
    name: CATEGORY_JS_APOLLO_GRAPHQL_NAME,
    value: CATEGORY_JS_APOLLO_GRAPHQL_VALUE,
  },
  {
    name: CATEGORY_TS_GENERAL_NAME,
    value: CATEGORY_TS_GENERAL_VALUE,
  },
  {
    name: CATEGORY_TS_TESTING_NAME,
    value: CATEGORY_TS_TESTING_VALUE,
  },
  {
    name: CATEGORY_TS_APOLLO_GRAPHQL_NAME,
    value: CATEGORY_TS_APOLLO_GRAPHQL_VALUE,
  },
];

export const RULESET_CHOICES = {
  [CATEGORY_PYTHON_GENERAL_VALUE]: [
    "for-testing", // for testing
    "python-security", // https://app.codiga.io/hub/ruleset/python-security
    "python-best-practices", // https://app.codiga.io/hub/ruleset/python-best-practices
    "python-code-style", // https://app.codiga.io/hub/ruleset/python-code-style
    "python-inclusive", // https://app.codiga.io/hub/ruleset/python-inclusive
  ],
  [CATEGORY_PYTHON_FLASK_VALUE]: [
    "python-flask", // https://app.codiga.io/hub/ruleset/python-flask
  ],
  [CATEGORY_JS_GENERAL_VALUE]: [
    "javascript-client-security", // https://app.codiga.io/hub/ruleset/javascript-client-security
    "javascript-inclusive", // https://app.codiga.io/hub/ruleset/javascript-inclusive
  ],
  [CATEGORY_JS_REACT_VALUE]: [
    "jsx-a11y", // https://app.codiga.io/hub/ruleset/jsx-a11y
    "jsx-react", // https://app.codiga.io/hub/ruleset/jsx-react
    "react-best-practices", // https://app.codiga.io/hub/ruleset/react-best-practices
  ],
  [CATEGORY_JS_EXPRESS_VALUE]: [
    "javascript-expressjs", // https://app.codiga.io/hub/ruleset/javascript-expressjs
    "javascript-knex", // https://app.codiga.io/hub/ruleset/javascript-knex
  ],
  [CATEGORY_JS_TESTING_VALUE]: [
    "playwright", // https://app.codiga.io/hub/ruleset/playwright
    "testing-library", // https://app.codiga.io/hub/ruleset/testing-library
    "jestjs", // https://app.codiga.io/hub/ruleset/jestjs
  ],
  [CATEGORY_JS_APOLLO_GRAPHQL_VALUE]: [
    "apollo-graphql-client-javascript", // https://app.codiga.io/hub/ruleset/apollo-graphql-client-javascript
  ],
  [CATEGORY_TS_GENERAL_VALUE]: [
    "typescript-best-practices", // https://app.codiga.io/hub/ruleset/typescript-best-practices
    "jsx-a11y", // https://app.codiga.io/hub/ruleset/jsx-a11y
    "jsx-react", // https://app.codiga.io/hub/ruleset/jsx-react
    "react-best-practices", // https://app.codiga.io/hub/ruleset/react-best-practices
  ],
  [CATEGORY_TS_TESTING_VALUE]: [
    "playwright", // https://app.codiga.io/hub/ruleset/playwright
    "testing-library", // https://app.codiga.io/hub/ruleset/testing-library
    "jestjs", // https://app.codiga.io/hub/ruleset/jestjs
  ],
  [CATEGORY_TS_APOLLO_GRAPHQL_VALUE]: [
    "apollo-graphql-client-javascript", // https://app.codiga.io/hub/ruleset/apollo-graphql-client-javascript
  ],
};

// EXTRA
export const STORE_API_TOKEN = "codiga-token";
export const BLANK_SHA = "0000000000000000000000000000000000000000";

// ROSIE
export const CODIGA_CONFIG_FILE = "codiga.yml";

export const LANGUAGE_PYTHON = "Python";
export const LANGUAGE_JAVASCRIPT = "Javascript";
export const LANGUAGE_TYPESCRIPT = "Typescript";

export const ROSIE_SUPPORTED_LANGUAGES = [
  LANGUAGE_PYTHON,
  LANGUAGE_JAVASCRIPT,
  LANGUAGE_TYPESCRIPT,
];

export const ROSIE_SUPPORTED_SUFFIX_TO_LANGUAGE = new Map([
  [".py", LANGUAGE_PYTHON],
  [".py3", LANGUAGE_PYTHON],
  [".js", LANGUAGE_JAVASCRIPT],
  [".jsx", LANGUAGE_JAVASCRIPT],
  [".ts", LANGUAGE_TYPESCRIPT],
  [".tsx", LANGUAGE_TYPESCRIPT],
]);

export const ELEMENT_CHECKED_FUNCTION_CALL = "FunctionCall";
export const ELEMENT_CHECKED_IF_CONDITION = "IfCondition";
export const ELEMENT_CHECKED_FOR_LOOP = "ForLoop";
export const ELEMENT_CHECKED_FUNCTION_DEFINITION = "FunctionDefinition";
export const ELEMENT_CHECKED_TRYBLOCK = "TryBlock";
export const ELEMENT_CHECKED_IMPORT = "Import";
export const ELEMENT_CHECKED_ASSIGNMENT = "Assignment";
export const ELEMENT_CHECKED_TYPE = "Type";
export const ELEMENT_CHECKED_INTERFACE = "Interface";
export const ELEMENT_CHECKED_HTML_ELEMENT = "HtmlElement";
export const ELEMENT_CHECKED_CLASS_DEFINITION = "ClassDefinition";
export const ELEMENT_CHECKED_FUNCTION_EXPRESSION = "FunctionExpression";

export const ROSIE_ENTITY_CHECKED_FUNCTION_CALL = "functioncall";
export const ROSIE_ENTITY_CHECKED_IF_CONDITION = "ifcondition";
export const ROSIE_ENTITY_FOR_LOOP = "forloop";
export const ROSIE_ENTITY_FUNCTION_DEFINITION = "functiondefinition";
export const ROSIE_ENTITY_TRYBLOCK = "tryblock";
export const ROSIE_ENTITY_IMPORT = "import";
export const ROSIE_ENTITY_ASSIGNMENT = "assign";
export const ROSIE_ENTITY_TYPE = "type";
export const ROSIE_ENTITY_INTERFACE = "interface";
export const ROSIE_ENTITY_HTML_ELEMENT = "htmlelement";
export const ROSIE_ENTITY_CLASS_DEFINITION = "classdefinition";
export const ROSIE_ENTITY_FUNCTION_EXPRESSION = "functionexpression";

export const ELEMENT_CHECKED_TO_ENTITY_CHECKED = new Map([
  [ELEMENT_CHECKED_FUNCTION_CALL, ROSIE_ENTITY_CHECKED_FUNCTION_CALL],
  [ELEMENT_CHECKED_IF_CONDITION, ROSIE_ENTITY_CHECKED_IF_CONDITION],
  [ELEMENT_CHECKED_FOR_LOOP, ROSIE_ENTITY_FOR_LOOP],
  [ELEMENT_CHECKED_FUNCTION_DEFINITION, ROSIE_ENTITY_FUNCTION_DEFINITION],
  [ELEMENT_CHECKED_TRYBLOCK, ROSIE_ENTITY_TRYBLOCK],
  [ELEMENT_CHECKED_IMPORT, ROSIE_ENTITY_IMPORT],
  [ELEMENT_CHECKED_ASSIGNMENT, ROSIE_ENTITY_ASSIGNMENT],
  [ELEMENT_CHECKED_TYPE, ROSIE_ENTITY_TYPE],
  [ELEMENT_CHECKED_INTERFACE, ROSIE_ENTITY_INTERFACE],
  [ELEMENT_CHECKED_HTML_ELEMENT, ROSIE_ENTITY_HTML_ELEMENT],
  [ELEMENT_CHECKED_CLASS_DEFINITION, ROSIE_ENTITY_CLASS_DEFINITION],
  [ELEMENT_CHECKED_FUNCTION_EXPRESSION, ROSIE_ENTITY_FUNCTION_EXPRESSION],
]);
