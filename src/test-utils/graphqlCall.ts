import { graphql, GraphQLSchema } from "graphql";
import { createSchema } from "../utils/createSchema";
import Maybe from "graphql/tsutils/Maybe";

interface Options {
  source: string;
  variableValues?: Maybe<{ [key: string]: any }>;
}

let schema: GraphQLSchema;

export const graphqlCall = async ({ source, variableValues }: Options) => {
  if (!schema) {
    schema = await createSchema();
  }

  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {},
      res: {
        clearCookie: jest.fn()
      }
    }
  });
};
