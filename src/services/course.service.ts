import { ConfigService } from "../config/config.service";
import { IPagination } from "../interfaces/config.interface";
import { ICourse } from "../interfaces/course.interface";
import ErrorHandler from "../utils/error-handler";
import { client } from "../utils/pg";

export class CourseService {
    static async getCourses (pagination: IPagination = ConfigService.get("pagination.coursePagtion")) {
        try {
            const courses: Array<ICourse> = (await client.query(`
                SELECT * FROM courses;
            `)).rows

            return courses;
        } catch (error) {
            throw await ErrorHandler(error);
        }
    }

    
}