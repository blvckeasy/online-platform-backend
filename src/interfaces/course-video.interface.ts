export interface IGetCourseVideosInput {
    id?: number;
    google_drive_video_id?: string;
    theme_id?: number;
}

export interface IGetCourseVideoInput {
    id: number;
}

export interface ICourseVideo {
    id: number;
    google_drive_video_id: string;
    theme_id: number;
    title: string;
    description?: string;
    uploaded_at: Date;
}

export interface IPostCourseVideoInput {
    theme_id: number;
    google_drive_video_id: string;
    title: string;
    description: string;
}

export interface IUpdateCourseVideoInput {
    course_video_id: number;
    title?: string;
}

export interface IDeleteCourseVideoInput {
    id: number;
}