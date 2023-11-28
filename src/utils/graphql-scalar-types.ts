import { GraphQLScalarType, Kind } from "graphql";


export default {
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'ISO 8601 formatted date and time string',
        parseValue: (value: string) => new Date(value), // parse input value
        serialize: (value: Date) => value.toISOString(), // serialize output value
        parseLiteral: (ast) => (ast.kind === Kind.STRING ? new Date(ast.value) : null), // parse AST literal
    }),
  };