import { gql } from "graphql-request";

export const CHECK_USER = gql`
  query checkUser {
    user {
      id
    }
  }
`;

export const GET_RULESETS_FOR_CLIENT = gql`
  query getRulesetsForClient($names: [String!]!) {
    ruleSetsForClient(names: $names) {
      id
      name
      rules(howmany: 10000, skip: 0) {
        id
        name
        content
        ruleType
        language
        pattern
        elementChecked
      }
    }
  }
`;
