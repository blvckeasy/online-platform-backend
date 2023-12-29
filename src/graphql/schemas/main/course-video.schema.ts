export const courseVideoTypeDef = `#graphql
    input GetCourseVideosInput {
        id: Int
        google_drive_video_id: String
        theme_id: Int
    }

    input GetCourseVideoInput {
        id: Int!
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
        google_drive_video_id: String!
        theme_id: Int!
        title: String!
        uploaded_at: DateTime
    }

    type Mutation {
        getCourseVideo (getCourseVideoInput: GetCourseVideoInput!): CourseVideo!
        getCourseVideos (getCourseVideosInput: GetCourseVideosInput): [CourseVideo!]
        updateCourseVideo (updateCourseVideoInput: UpdateCourseVideoInput!): CourseVideo!
        deleteCourseVideo (deleteCourseVideoInput: DeleteCourseVideoInput!): CourseVideo!
    }

`