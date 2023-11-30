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

    static async getCourse (getCourseInput: IGetCourse = {}): Promise<ICourse[]> {
        try {
            const { id } = getCourseInput;

            const foundCourses: ICourse[] = (await client.query(`
                SELECT * FROM courses 
                WHERE 
                    id = CASE WHEN $1 > 0 THEN $1 ELSE -1 END OR
                    CASE WHEN $1 IS NULL THEN TRUE ELSE FALSE END;
            `, [id])).rows;

            return foundCourses;
        } catch (error) {
            throw await ErrorHandler(error);
        }
    }
}