import { ICourseTheme, ICourseThemeWithVideos, ICreateCourseThemeInput, IGetCourseThemeInput } from "../interfaces/course-theme.interface";
import ErrorHandler, { ErrorTypes } from "../utils/error-handler";
import { NotFoundException } from "../utils/errors";
import { client } from "../utils/pg";
import { CourseService } from "./course.service";


export class CourseThemeService {
    static async getCourseThemes (getCourseThemeInput: IGetCourseThemeInput = {}): Promise<ICourseThemeWithVideos[]> {
        try {
            const { id, course_id } = getCourseThemeInput;
            const courseThemes: ICourseThemeWithVideos[] = (await client.query(`
                SELECT * FROM course_themes
                WHERE
                    id = CASE WHEN $1 > 0 THEN $1 ELSE -1 END OR
                    course_id = CASE WHEN $2 > 0 THEN $2 ELSE -1 END OR
                    CASE WHEN $1 IS NULL AND $2 IS NULL THEN true ELSE false END
            `, [id, course_id])).rows;

            return courseThemes;
        } catch (error) {
            throw await ErrorHandler(error);
        }
    }

    static async createCourseTheme (createCourseThemeInput: ICreateCourseThemeInput) {
        try {
            const { course_id, title, description } = createCourseThemeInput;
            const foundCourse = await CourseService.getCourse({ id: course_id });
            
            if (!foundCourse) throw new NotFoundException("Course is not found!", ErrorTypes.NOT_FOUND);

            const newCourseTheme: ICourseTheme = (await client.query(`
                INSERT INTO course_themes (course_id, title, description) VALUES ($1, $2, $3) RETURNING *;
            `, [course_id, title, description])).rows[0];
        
            return newCourseTheme;
        } catch (error) {
            throw await ErrorHandler(error);
        }
    } 
}