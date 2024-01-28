export const userActivitiesTypeDef = `#graphql
    scalar Date
    
    input GetActivitiesInput {
        from_date: Date
        to_date: Date
    }

    type Mutation {
        getMyActivities (getActivitiesInput: GetActivitiesInput!): String!
    }
`