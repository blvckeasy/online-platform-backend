export const userTypeDef = `#graphql
    scalar DateTime

    enum EUserRole {
        admin
        teacher
        student
    }

    input CreateUserInput {
        fullname: String
        telegram_user_id: Int!
        contact: String!
        role: EUserRole
    }

    input UpdateUserInput {
        fullname: String
        role: EUserRole
    }
    
    type Token {
        access_token: String!
        refresh_token: String!
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

    type Query {
        user: String
        deleteUser: User
    }

    type Mutation {
        createUser(createUserInput: CreateUserInput!): ResponseUser!
        updateUser(updateUserInput: UpdateUserInput!): User!
    }
`;