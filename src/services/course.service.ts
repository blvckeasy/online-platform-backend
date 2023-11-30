import { ConfigService } from "../config/config.service";
import { IPagination } from "../interfaces/config.interface";
import { ICourse, IGetCourse } from "../interfaces/course.interface";
import ErrorHandler from "../utils/error-handler";
import { client } from "../utils/pg";

export class CourseService {
    static async getCourses (pagination: IPagination = ConfigService.get("pagination.coursePagtion")): Promise<Array<ICourse>> {
        try {
            const { page, limit } = pagination;
            const courses: Array<ICourse> = (await client.query(`
                SELECT * FROM courses OFFSET $1 LIMIT $2;
            `, [page * limit - limit, limit])).rows

            return courses;
        } catch (error) {
            throw await ErrorHandler(error);
        }
    }

    static async getCourse (getCourseInput: IGetCourse) {
        try {
            const foundCourse: ICourse[] = (await client.query(`
                SELECT
                    *
                FROM courses as c
                LEFT JOIN course_themes as ct
                ON c.id = ct.course_id
                LEFT JOIN course_videos as cv
                ON ct.id = cv.theme_id
                WHERE c.id = $1;
            `, [getCourseInput.id])).rows

            console.log(foundCourse);

            return foundCourse;
        } catch (error) {
            throw await ErrorHandler(error);
        }
    }
}