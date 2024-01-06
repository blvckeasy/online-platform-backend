import { ICourse } from "./course.interface";

export interface ICreateCourseVideoWithoutVideo {
    theme_id: number;
    title: string;
    description?: string;
}

export interface ICourseVideo {
    id: number;
    google_drive_video_id: string;
    theme_id: number;
    position: number;
    title: string;
    description?: string;
    uploaded_at: Date;
}

export interface ICourseVideoWithoutVideo {
    id: number;
    theme_id: number;
    position: number;
    title: string;
    description?: string;
    uploaded_at: Date;
}

export interface IGetCourseVideosInput {
    id?: number;
    google_drive_video_id?: string;
    theme_id?: number;
}

export interface IGetCourseVideoInput {
    id: number;
}

export interface IPostCourseVideoInput {
    theme_id: number;
    google_drive_video_id: string;
    title: string;
    description: string;
}

export interface IUpdateCourseVideoInput {
    course_video_id: number;
    google_drive_video_id?: string;
    title?: string;
    description?: string;
}

export interface IUpdateCourseVideoPositionInput {
    course_id: number;
    after_video_id?: number;
    before_video_id?: number;
}

export interface IDeleteCourseVideoInput {
    id: number;
}