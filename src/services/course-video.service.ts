import {
    ICourseVideo,
    ICourseVideoWithoutVideo,
    ICreateCourseVideoWithoutVideo,
    IDeleteCourseVideoInput,
    IGetCourseVideoInput,
    IGetCourseVideosInput,
    IPostCourseVideoInput,
    IUpdateCourseVideoInput,
    IUpdateCourseVideoPositionInput
} from "../interfaces/course-video.interface";
import { ErrorTypes } from "../utils/error-handler";
import { NotFoundException, RequiredParamException } from "../utils/errors";
import { client } from "../utils/pg";


export class CourseVideoService {
    static async generatePositionNumber(theme_id: number): Promise<number> {
        const theme_videos = await this.getCourseVideos({ theme_id });
        return theme_videos.length + 1
    }

    static async createCourseVideoWithoutVideo (
        createCourseVideoWithoutVideoInput: ICreateCourseVideoWithoutVideo
    ): Promise<ICourseVideoWithoutVideo> {
        const { theme_id, title, description } = createCourseVideoWithoutVideoInput;
        const position = await this.generatePositionNumber(theme_id);

        const newCourseVideoWithoutVideo = (await client.query(`
            INSERT INTO COURSE_VIDEOS (THEME_ID, TITLE, DESCRIPTION, POSITION) VALUES ($1, $2, $3, $4) RETURNING *;
        `, [theme_id, title, description, position])).rows[0] as ICourseVideoWithoutVideo;

        return newCourseVideoWithoutVideo;
    }

    static async postCourseVideo (postCourseVideoInput: IPostCourseVideoInput): Promise<ICourseVideo> {
        const { google_drive_video_id, theme_id, title } = postCourseVideoInput;
        const position = await this.generatePositionNumber(theme_id);

        const newCourseVideo: ICourseVideo = (await client.query(`
            INSERT INTO COURSE_VIDEOS (GOOGLE_DRIVE_VIDEO_ID, THEME_ID, TITLE, POSITION) VALUES ($1, $2, $3, $4) RETURNING *;
        `, [ google_drive_video_id, theme_id, title, position])).rows[0];

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
            ORDER BY position;
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
                google_drive_video_id = CASE WHEN length($2) > 0 THEN $2 ELSE google_drive_video_id END,
                title = CASE WHEN length($3) > 0 THEN $3 ELSE title END,
                description = CASE WHEN length($4) > 0 THEN $4 ELSE description END
            WHERE
                id = $1
            RETURNING *;
        `, [course_video_id, google_drive_video_id, title, description])).rows[0];

        return updatedCourseVideo;
    }

    static async updateCourseVideoPosition (
        updateCourseVideoPositionInput: IUpdateCourseVideoPositionInput
    ): Promise<ICourseVideo> {
        const { after_video_id, before_video_id, course_id } = updateCourseVideoPositionInput;

        if (!course_id)
            throw new RequiredParamException(
                "course_id param is required!",
                ErrorTypes.REQUIRED_PARAM,
            );

        if (after_video_id && before_video_id)
            throw new RequiredParamException(
                "you can send either after_video_id or before_video_id parameters to the server.", 
                ErrorTypes.REQUIRED_PARAM
            );
    
        if (!(after_video_id || before_video_id))
            throw new RequiredParamException(
                "after_video_id or before_video_id must be required!", 
                ErrorTypes.REQUIRED_PARAM
            )
        
        const courseVideo = await this.getCourseVideo({ id: course_id });
        if (!courseVideo) throw new NotFoundException("Course is not found!", ErrorTypes.NOT_FOUND);

        const afterCourseVideo = await this.getCourseVideo({ id: after_video_id || -1 });
        const beforeCourseVideo = await this.getCourseVideo({ id: before_video_id || -1 });

        if (afterCourseVideo) {
            
            if (courseVideo.position < afterCourseVideo.position) {
                await client.query(`
                    UPDATE COURSE_VIDEOS
                    SET
                        position = position - 1
                    WHERE
                        theme_id = $1 AND position > $2 AND position <= $3;
                `, [afterCourseVideo.theme_id, courseVideo.position, afterCourseVideo.position]);
                
                const updatedCourseVideo = (await client.query(`
                    UPDATE COURSE_VIDEOS
                    SET
                        position = $2,
                        theme_id = $3
                    WHERE
                        id = $1
                    RETURNING *;
                    `, [courseVideo.id, afterCourseVideo.position, afterCourseVideo.theme_id])
                ).rows[0] as ICourseVideo;
                
                return updatedCourseVideo

            } else if (courseVideo.position > afterCourseVideo.position) {
                await client.query(`
                    UPDATE COURSE_VIDEOS
                    SET
                        position = position + 1
                    WHERE
                        theme_id = $1 AND position > $2 AND position < $3
                `, [afterCourseVideo.theme_id, afterCourseVideo.position, courseVideo.position])

                const updatedCourseVideo = (await client.query(`
                    UPDATE COURSE_VIDEOS
                    SET
                        position = $2,
                        theme_id = $3
                    WHERE
                        id = $1
                    RETURNING *;
                    `, [courseVideo.id, afterCourseVideo.position + 1, afterCourseVideo.theme_id])
                ).rows[0] as ICourseVideo;
                
                return updatedCourseVideo;
            }

        } else if (beforeCourseVideo) {

            if (courseVideo.position < beforeCourseVideo.position) {
                await client.query(`
                    UPDATE COURSE_VIDEOS
                    SET
                        position = position - 1
                    WHERE
                        theme_id = $1 AND position < $2 AND position > $3
                `, [beforeCourseVideo.theme_id, beforeCourseVideo.position, courseVideo.position]);

                const updatedCourseVideo = (await client.query(`
                    UPDATE COURSE_VIDEOS
                    SET
                        position = $2,
                        theme_id = $3
                    WHERE
                        id = $1
                    RETURNING *;
                `, [courseVideo.id, beforeCourseVideo.position - 1, beforeCourseVideo.theme_id])).rows[0] as ICourseVideo;

                return updatedCourseVideo;

            } else if (courseVideo.position > beforeCourseVideo.position) {
                await client.query(`
                    UPDATE COURSE_VIDEOS
                    SET
                        position = position + 1
                    WHERE
                        theme_id = $1 AND position >= $2 AND position < $3
                `, [beforeCourseVideo.theme_id, beforeCourseVideo.position, courseVideo.position]);

                const updateCourseVideo = (await client.query(`
                    UPDATE COURSE_VIDEOS
                    SET
                        position = $3,
                        theme_id = $4
                    WHERE
                        id = $1
                    RETURNING *;
                `, [courseVideo.id, beforeCourseVideo.position, beforeCourseVideo.theme_id])).rows[0] as ICourseVideo;

                return updateCourseVideo;
            }

        } 
    }

    static async deleteCourseVideo (deleteCourseVideoInput: IDeleteCourseVideoInput): Promise<ICourseVideo> {
        const { id } = deleteCourseVideoInput;
        const deletedCourseVideo: ICourseVideo = (await client.query(`
            DELETE FROM COURSE_VIDEOS WHERE id = $1 RETURNING *;
        `, [id])).rows[0];

        return deletedCourseVideo;
    }
}