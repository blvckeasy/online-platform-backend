export const authTypeDef = `#graphql
    scalar DateTime

    input CreateUserQueueInput {
        fullname: String
        telegram_user_id: Int!
        contact: String!
    }

    input RegisterUserInput {
        fullname: String
        telegram_user_id: Int!
        code: Int!
    }

    type CreatedOTPResponse {
        id: Int!
        telegram_user_id: Int!
        code: Int!
        sended_time: DateTime
    }


    type Mutation {
        generateCode(createUserQueueInput: CreateUserQueueInput!): CreatedOTPResponse!
        register(registerUserInput: RegisterUserInput!): ResponseUser!
    }
`