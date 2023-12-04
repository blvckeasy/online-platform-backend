export const courseTypeDef = `#graphql
    input GetCourseInput {
        id: Int!
    }

    input CreateCourseInput {
        name: String!
        price: Float
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
        createCourse(createCourseInput: CreateCourseInput): Course!
        getCourse(getCourseInput: GetCourseInput!): GetCourseResponse!
    }
`