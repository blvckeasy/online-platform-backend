import { ConfigService } from "../config/config.service";
import { IPagination } from "../interfaces/config.interface";
import { ICourse, IGetCourse } from "../interfaces/course.interface";
import ErrorHandler from "../utils/error-handler";
import { client } from "../utils/pg";

export class CourseService {
    static async getCourses (pagination?: IPagination): Promise<ICourse[]> {
        const configPagination: IPagination = ConfigService.get("pagination.coursePagtion");
        const page = pagination?.page || configPagination.page
        const limit = pagination?.limit || configPagination.limit
        const offset = page * limit - limit;

        const courses: Array<ICourse> = (await client.query(`
            SELECT * FROM courses OFFSET $1 LIMIT $2;
        `, [offset, limit])).rows

        return courses;
    }

    static async getCourse (getCourseInput: IGetCourse = {}, pagination?: IPagination): Promise<ICourse[]> {
        const configPagination: IPagination = ConfigService.get("pagination.coursePagtion");
        const page = pagination?.page || configPagination.page
        const limit = pagination?.limit || configPagination.limit
        const offset = page * limit - limit;
        const { id } = getCourseInput;

        const foundCourses: ICourse[] = (await client.query(`
            SELECT * FROM courses 
            WHERE 
                id = CASE WHEN $1 > 0 THEN $1 ELSE -1 END OR
                CASE WHEN $1 IS NULL THEN TRUE ELSE FALSE END
            OFFSET $2
            LIMIT $3;
        `, [id, offset, limit])).rows;

        return foundCourses;
    }
}