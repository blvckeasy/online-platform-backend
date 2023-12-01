import { ICourseThemeWithVideos } from "./course-theme.interface";


export interface ICourse {
    id: number;
    user_id: number;
    name: string;
    price?: number;
}

export interface IGetCourse {
    id?: number;
}

export interface IGetCourseResponse {
    course: ICourse,
    themes?: [ICourseThemeWithVideos]
}