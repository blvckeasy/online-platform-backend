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

    type CourseWithUser {
        course: Course!
        author: User!
    }

    type GetCourseResponse {
        course: Course
        themes: [CourseThemeWithVideo]
    }

    type Query {
        getCourses: [CourseWithUser!]
    }

    type Mutation {
        getCourse(getCourseInput: GetCourseInput!): GetCourseResponse
    }
`