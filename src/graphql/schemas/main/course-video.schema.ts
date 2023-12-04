export const courseVideoTypeDef = `#graphql
    input GetCourseVideosInput {
        id: Int
        video_url: String
        theme_id: Int
    }

    input updateCourseVideoInput {
        course_video_id: Int!
        title: String
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
        getCourseVideos (getCourseVideosInput: GetCourseVideosInput): [CourseVideo!]
        updateCourseVideo (updateCourseVideoInput: updateCourseVideoInput!): CourseVideo!
    }

`