import { ICourseVideo, IDeleteCourseVideoInput, IGetCourseVideoInput, IGetCourseVideosInput, IPostCourseVideoInput, IUpdateCourseVideoInput } from "../interfaces/course-video.interface";
import { client } from "../utils/pg";


export class CourseVideoService {
    static async postCourseVideo (postCourseVideoInput: IPostCourseVideoInput): Promise<ICourseVideo> {
        const { thumbnail_url, video_url, theme_id, title } = postCourseVideoInput;

        const newCourseVideo: ICourseVideo = (await client.query(`
            INSERT INTO COURSE_VIDEOS (thumbnail_url, video_url, theme_id, title) VALUES ($1, $2, $3, $4) RETURNING *;
        `, [thumbnail_url, video_url, theme_id, title])).rows[0];

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
        const { course_video_id, title } = updateCourseVideoInput
        const updatedCourseVideo: ICourseVideo = (await client.query(`
            UPDATE COURSE_VIDEOS
            SET
                title = CASE WHEN length($1) > 0 THEN $1 ELSE title END
            WHERE
                id = $2
            RETURNING *;
        `, [title, course_video_id])).rows[0];

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