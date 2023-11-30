export const courseVideoTypeDef = `#graphql
    input GetCourseVideoInput {
        id: Int
        video_url: String
        theme_id: Int
    }
    
    type CourseVideo {
        id: Int!
        thumbnail_url: String!
        video_url: String!
        theme_id: Int!
        title: String!
        uploaded_at: DateTime
    }

    type Mutation {
        getCourseVideos (getCourseVideosInput: GetCourseVideoInput): [CourseVideo!]
    }

`