import { ICourseThemeWithVideos } from "./course-theme.interface";
import { IUser } from "./user.interface";


export interface ICourse {
    id: number;
    user_id: number;
    google_drive_thumbnail_id: string;
    title: string;
    price?: number;
    description?: string;
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
    google_drive_thumbnail_id: string;
    price?: number;
    description?: string;
}