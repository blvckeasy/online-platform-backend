export const courseVideoTypeDef = `#graphql
    input CreateCourseVideoWithoutVideoInput {
        theme_id: Int!
        title: String!
        description: String
    }

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

    input UpdateCourseVideoPositionInput {
        course_id: Int!
        after_video_id: Int
        before_video_id: Int
    }
    
    input DeleteCourseVideoInput {
        id: Int!
    }

    type CourseVideo {
        id: Int!
        google_drive_video_id: String
        position: Int
        theme_id: Int!
        title: String!
        uploaded_at: DateTime
    }

    type CourseVideoWithoutVideo {
        id: Int!
        theme_id: Int!
        position: Int
        title: String!
        uploaded_at: DateTime
    }

    type Mutation {
        createCourseVideoWithoutVideo (createCourseVideoWithoutVideoInput: CreateCourseVideoWithoutVideoInput!): CourseVideoWithoutVideo
        getCourseVideo (getCourseVideoInput: GetCourseVideoInput!): CourseVideo
        getCourseVideos (getCourseVideosInput: GetCourseVideosInput): [CourseVideo!]
        updateCourseVideo (updateCourseVideoInput: UpdateCourseVideoInput!): CourseVideo!
        updateCourseVideoPosition (updateCourseVideoPositionInput: UpdateCourseVideoPositionInput!): CourseVideo!
        deleteCourseVideo (deleteCourseVideoInput: DeleteCourseVideoInput!): CourseVideo!
    }

`