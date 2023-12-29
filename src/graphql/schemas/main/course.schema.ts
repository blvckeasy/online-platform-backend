export const courseTypeDef = `#graphql
    input GetCourseInput {
        id: Int!
    }

    type Course {
        id: Int!
        user_id: Int!
        google_drive_thumbnail_id: String!
        title: String!
        price: Float
        description: String
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
        getCourse(getCourseInput: GetCourseInput!): GetCourseResponse!
    }
`