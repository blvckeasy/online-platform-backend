export const courseVideoTypeDef = `#graphql
    input GetCourseVideosInput {
        id: Int
        video_url: String
        theme_id: Int
    }

    input UpdateCourseVideoInput {
        course_video_id: Int!
        title: String
    }
    
    input DeleteCourseVideoInput {
        id: Int!
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
        updateCourseVideo (updateCourseVideoInput: UpdateCourseVideoInput!): CourseVideo!
        deleteCourseVideo (deleteCourseVideoInput: DeleteCourseVideoInput!): CourseVideo!
    }

`