import { ICourseVideo } from "./course-video.interface";


export interface ICourseTheme {
    id: number;
    course_id: number;
    title: string;
    description: string;
}

export interface ICourseThemeWithVideos {
    id: number;
    course_id: number;
    title: string;
    description: string;
    videos?: ICourseVideo[];
}

export interface IGetCourseThemesInput {
    id?: number;
    course_id?: number;
}

export interface IGetCourseThemeInput {
    id: number;
}

export interface ICreateCourseThemeInput {
    course_id: number;
    title: string;
    description: string;
}