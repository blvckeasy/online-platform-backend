export const courseRatingTypeDef = `#graphql
    scalar Date
    
    input CreateCourseRatingInput {
        course_id: Int!
        rating: Int!
    }

    input GetCourseRatingInput {
        course_id: Int!
    }

    type CourseRating {
        id: Int!
        course_id: Int!
        rating: Int!
        rated_at: Date!
    }

    type Mutation {
        createCourseRating(createCourseRatingInput: CreateCourseRatingInput!): CourseRating!
        getCourseRating(getCourseRatingInput: GetCourseRatingInput!): CourseRating
    }
`