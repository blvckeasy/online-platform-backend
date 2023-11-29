export const courseTypeDef = `#graphql
    type Course {
        id: Int!
        user_id: Int!
        name: String!
        price: Float
    }

    type Query {
        getCourses: [Course!]
    }
`