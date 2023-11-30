export const courseVideoTypeDef = `#graphql
    type CourseVideo {
        id: Int!
        thumbnail_url: String!
        video_url: String!
        theme_id: Int!
        title: String!
        uploaded_at: DateTime
    }
`