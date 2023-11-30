export const courseThemeTypeDef = `#graphql
    type CourseTheme {
        id: Int!
        course_id: Int!
        thumbnail_url: String!
        title: String!
        description: String!
    }
`