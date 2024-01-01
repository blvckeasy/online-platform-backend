import {
    ICourseVideo,
    ICourseVideoWithoutVideo,
    ICreateCourseVideoWithoutVideo,
    IDeleteCourseVideoInput,
    IGetCourseVideoInput,
    IGetCourseVideosInput,
    IPostCourseVideoInput,
    IUpdateCourseVideoInput
} from "../interfaces/course-video.interface";
import { client } from "../utils/pg";


export class CourseVideoService {
    static async createCourseVideoWithoutVideo (createCourseVideoWithoutVideoInput: ICreateCourseVideoWithoutVideo): Promise<ICourseVideoWithoutVideo> {
        const { theme_id, title, description } = createCourseVideoWithoutVideoInput;
    
        const newCourseVideoWithoutVideo = (await client.query(`
            INSERT INTO COURSE_VIDEOS (THEME_ID, TITLE, DESCRIPTION) VALUES ($1, $2, $3) RETURNING *;
        `, [theme_id, title, description])).rows[0] as ICourseVideoWithoutVideo;

        return newCourseVideoWithoutVideo;
    }

    static async postCourseVideo (postCourseVideoInput: IPostCourseVideoInput): Promise<ICourseVideo> {
        const { google_drive_video_id, theme_id, title } = postCourseVideoInput;

        const newCourseVideo: ICourseVideo = (await client.query(`
            INSERT INTO COURSE_VIDEOS (google_drive_video_id, theme_id, title) VALUES ($1, $2, $3) RETURNING *;
        `, [ google_drive_video_id, theme_id, title])).rows[0];

        return newCourseVideo;
    }

    static async getCourseVideos (getCourseVideosInput: IGetCourseVideosInput = {}): Promise<ICourseVideo[]> {
        const { id, theme_id } = getCourseVideosInput;
        const courseVideos: ICourseVideo[] = (await client.query(`
            SELECT * FROM course_videos
            WHERE
                id = CASE WHEN $1 > 0 THEN $1 ELSE -1 END OR
                theme_id = CASE WHEN $2 > 0 THEN $2 ELSE -1 END OR
                CASE WHEN $1 IS NULL AND $2 IS NULL THEN true ELSE false END
            ORDER BY uploaded_at
        `, [id, theme_id])).rows;

        return courseVideos;
    }

    static async getCourseVideo (getCourseVideo: IGetCourseVideoInput): Promise<ICourseVideo> {
        const { id } = getCourseVideo;

        const courseVideo: ICourseVideo = (await client.query(`
            SELECT * FROM course_videos
            WHERE id = $1
            LIMIT 1;
        `, [id])).rows[0];

        return courseVideo;
    }

    static async updateCourseVideo (updateCourseVideoInput: IUpdateCourseVideoInput): Promise<ICourseVideo> {
        const { course_video_id, title, google_drive_video_id, description } = updateCourseVideoInput
        const updatedCourseVideo: ICourseVideo = (await client.query(`
            UPDATE COURSE_VIDEOS
            SET
                google_drive_video_id = CASE WHEN length($1) > 0 THEN $1 ELSE google_drive_video_id END,
                title = CASE WHEN length($2) > 0 THEN $2 ELSE title END,
                description = CASE WHEN length($3) > 0 THEN $3 ELSE description END
            WHERE
                id = $1
            RETURNING *;
        `, [course_video_id, google_drive_video_id, title, description])).rows[0];

        return updatedCourseVideo;
    }

    static async deleteCourseVideo (deleteCourseVideoInput: IDeleteCourseVideoInput): Promise<ICourseVideo> {
        const { id } = deleteCourseVideoInput;
        const deletedCourseVideo: ICourseVideo = (await client.query(`
            DELETE FROM COURSE_VIDEOS WHERE id = $1 RETURNING *;
        `, [id])).rows[0];

        return deletedCourseVideo;
    }
}