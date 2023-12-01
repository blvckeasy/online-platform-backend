export const courseTypeDef = `#graphql
    input GetCourseInput {
        id: Int!
    }

    type Course {
        id: Int!
        user_id: Int!
        name: String!
        price: Float
    }

    type Query {
        getCourses: [Course!]
    }

    type GetCourseResponse {
        course: Course
        themes: [CourseThemeWithVideo]
    }

    type Mutation {
        getCourse(getCourseInput: GetCourseInput!): GetCourseResponse
    }
`