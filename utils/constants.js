import pkg from "../package.json";
const { version } = pkg;

// COMMAND ACTIONS
export const ACTION_TOKEN_ADD = "token-add";
export const ACTION_TOKEN_CHECK = "token-check";
export const ACTION_TOKEN_DELETE = "token-delete";
export const ACTION_GIT_PUSH_HOOK = "git-push-hook";

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
