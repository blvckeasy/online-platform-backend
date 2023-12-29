import { ConfigService } from "../config/config.service";
import { IPagination } from "../interfaces/config.interface";
import { ICourse, ICreateCourseInput, IGetCourse } from "../interfaces/course.interface";
import { ErrorTypes } from "../utils/error-handler";
import { NotFoundException } from "../utils/errors";
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

    static async getSearchCourses (getCourseInput: IGetCourse = {}, pagination?: IPagination): Promise<ICourse[]> {
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

    static async createCourse (user_id: number, createCourseInput: ICreateCourseInput): Promise<ICourse> {
        const { title, price, google_drive_thumbnail_id, description } = createCourseInput;
        if (!title) throw new NotFoundException("Video title is required!", ErrorTypes.NOT_FOUND);

        const newCourse: ICourse = (await client.query(`
            INSERT INTO COURSES (user_id, google_drive_thumbnail_id, title, price, description) VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `, [user_id, google_drive_thumbnail_id, title, price, description])).rows[0];

        return newCourse;
    }
}