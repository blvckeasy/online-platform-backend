export const courseThemeTypeDef = `#graphql
    input GetCourseThemeInput {
        id: Int
        course_id: Int
    }

    input CreateCourseThemeInput {
        course_id: Int!
        title: String!
        description: String!
    }

    type CourseTheme {
        id: Int!
        course_id: Int!
        title: String!
        description: String!
    }

    type CourseThemeWithVideo {
        id: Int!
        course_id: Int!
        title: String!
        description: String!
        videos: [CourseVideo]
    }

    type Mutation {
        getCourseThemes(getCourseThemeInput: GetCourseThemeInput): [CourseTheme!]
        createCourseTheme(createCourseThemeInput: CreateCourseThemeInput): [CourseTheme!]
    }
`