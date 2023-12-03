export interface IGetCourseVideosInput {
    id?: number;
    video_url?: string;
    theme_id?: number;
}

export interface ICourseVideo {
    id: number;
    thumbnail_url: string;
    video_url: string;
    theme_id: number;
    title: string;
    uploaded_at: Date;
}

export interface IPostCourseVideoInput {
    thumbnail_url: string;
    video_url: string;
    theme_id: number;
    title: string;
}