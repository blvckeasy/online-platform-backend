import { ICourseThemeWithVideos } from "./course-theme.interface";
import { IUser } from "./user.interface";


export interface ICourse {
    id: number;
    user_id: number;
    thumbnail_url: string;
    title: string;
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
    title: string;
    thumbnail_url: string;
    price?: number;
}