import { ICourseVideo, IGetCourseVideosInput, IPostCourseVideoInput } from "../interfaces/course-video.interface";
import ErrorHandler from "../utils/error-handler";
import { client } from "../utils/pg";

export class CourseVideoService {
    static async postCourseVideo (postCourseVideoInput: IPostCourseVideoInput): Promise<ICourseVideo> {
        const {  }
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
}