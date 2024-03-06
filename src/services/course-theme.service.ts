import {
	ICourseTheme,
	ICourseThemeWithVideos,
	ICreateCourseThemeInput,
	IGetCourseThemeInput,
	IGetCourseThemesInput,
} from "../interfaces/course-theme.interface";
import { ErrorTypes } from "../utils/error-handler";
import { InternalServerError, NotFoundException } from "../utils/errors";
import { client } from "../utils/pg";
import { CourseVideoService } from "./course-video.service";
import { CourseService } from "./course.service";

export class CourseThemeService {
    /**
     * 
     * @param getCourseThemesInput 
     * @returns 
     */
	static async getCourseThemes(
		getCourseThemesInput: IGetCourseThemesInput = {}
	): Promise<ICourseThemeWithVideos[]> {
		const { id, course_id } = getCourseThemesInput;
		const themes: ICourseThemeWithVideos[] = (
			await client.query(
				`
            SELECT 
                *
            FROM course_themes
            WHERE
                id = CASE WHEN $1 > 0 THEN $1 ELSE -1 END OR
                course_id = CASE WHEN $2 > 0 THEN $2 ELSE -1 END OR
                CASE WHEN $1 IS NULL AND $2 IS NULL THEN true ELSE false END
        `,
				[id, course_id]
			)
		).rows;

		for await (const theme of themes) {
			theme.videos = await CourseVideoService.getCourseVideos({
				theme_id: theme.id,
			});
		}

		return themes;
	}


    /**
     * 
     * @param getCourseThemeInput 
     * @returns 
     */
	static async getCourseTheme(
		getCourseThemeInput: Required<IGetCourseThemeInput>
	): Promise<ICourseThemeWithVideos> {
		const id = getCourseThemeInput?.id;
		if (!id)
			throw new InternalServerError(
				"id is require!",
				ErrorTypes.INTERNAL_SERVER_ERROR
			);

		const theme: ICourseThemeWithVideos = (
			await client.query(
				`
            SELECT * FROM course_themes
            WHERE id = $1
            LIMIT 1;
        `,
				[id]
			)
		).rows[0];

		if (theme) {
			theme.videos = await CourseVideoService.getCourseVideos({
				theme_id: theme.id,
			});
		}

		return theme;
	}


    /**
     * 
     * @param createCourseThemeInput 
     * @returns 
     */
	static async createCourseTheme(
		createCourseThemeInput: ICreateCourseThemeInput
	): Promise<ICourseTheme> {
		const { course_id, title } = createCourseThemeInput;
		const foundCourse = await CourseService.getSearchCourses({
			id: course_id,
		});

		if (!foundCourse)
			throw new NotFoundException(
				"Course is not found!",
				ErrorTypes.NOT_FOUND
			);

		const newCourseTheme: ICourseTheme = (
			await client.query(
				`
            INSERT INTO course_themes (course_id, title) VALUES ($1, $2) RETURNING *;
        `,
				[course_id, title]
			)
		).rows[0];

		return newCourseTheme;
	}
}
