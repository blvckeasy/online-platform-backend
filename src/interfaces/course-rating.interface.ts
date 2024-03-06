export interface ICourseRating {
    id: number;
    course_id: number;
    rating: number;
}

export interface IGetCourseRating {
    course_id: number;
}

export interface ICreateCourseRating {
    course_id: number;
    rating: number;
    user_id?: number;
}

export interface IUpdateCourseRating {
    course_id: number;
    user_id: number;
    rating: number;
}