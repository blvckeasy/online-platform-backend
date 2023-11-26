export const userTypeDef = `#graphql
    scalar DateTime

    # type AlreadyExistsExcaption {
    #     message: String!
    #     code: Int!
    # }

    enum EUserRole {
        ADMIN
        TEACHER
        STUDENT
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

    # union CreateUserResponse = ResponseUser | AlreadyExistsExcaption;

    type Mutation {
        createUser(createUserInput: CreateUserInput!): ResponseUser
    }
`;