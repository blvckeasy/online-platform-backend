export const authTypeDef = `#graphql
    scalar DateTime

    input CreateUserQueueInput {
        fullname: String
        telegram_user_id: Int!
        contact: String!
    }

    type CreatedOTPResponse {
        id: Int!
        telegram_user_id: Int!
        code: Int!
        sended_time: DateTime
    }


    type Mutation {
        generateCode(createUserQueueInput: CreateUserQueueInput!): CreatedOTPResponse!
    }
`