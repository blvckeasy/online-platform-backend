export const courseThemeTypeDef = `#graphql
    input GetCourseThemesInput {
        id: Int
        course_id: Int
    }

    input CreateCourseThemeInput {
        course_id: Int!
        title: String!
        description: String!
    }

    input GetCourseThemeInput {
        id: Int!
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
        getCourseTheme (getCourseThemeInput: GetCourseThemeInput!): CourseThemeWithVideo!
        getCourseThemes(getCourseThemesInput: GetCourseThemesInput): [CourseThemeWithVideo!]
        createCourseTheme(createCourseThemeInput: CreateCourseThemeInput!): CourseTheme!
    }
`