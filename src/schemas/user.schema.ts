export const userTypeDef = `#graphql
    scalar DateTime

    enum EUserRole {
        admin
        teacher
        student
    }
    
    type Token {
        access_token: String!
        refresh_token: String!
    }

    input CreateUserInput {
        fullname: String
        telegram_user_id: Int!
        contact: String!
        role: EUserRole
    }

    type Query {
        user: String
    }

    type User {
        id: ID!
        fullname: String
        telegram_user_id: Int!
        contact: String!
        role: EUserRole!
        signed_time: DateTime
    }

    type ResponseUser {
        user: User!
        token: Token!
    }

    type Mutation {
        createUser(createUserInput: CreateUserInput!): ResponseUser!
    }
`