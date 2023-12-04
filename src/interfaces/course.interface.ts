import { ICourseThemeWithVideos } from "./course-theme.interface";
import { IUser } from "./user.interface";


export interface ICourse {
    id: number;
    user_id: number;
    name: string;
    price?: number;
}

export interface ICourseWithUser {
    course: ICourse;
    author: IUser;
}

export interface IGetCourse {
    id?: number;
}

export interface IGetCourseResponse {
    course: ICourse,
    themes?: [ICourseThemeWithVideos]
}

export interface ICreateCourseInput {
    name: string;
    price?: number;
}