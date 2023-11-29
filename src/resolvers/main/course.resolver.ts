import { BaseContext } from "@apollo/server";
import { IUser } from "../../interfaces/user.interface";
import JWT from "../../utils/jwt";
import { ICourse } from "../../interfaces/course.interface";
import { CourseService } from "../../services/course.service";

export const CourseResolver: BaseContext = {
    Query: {
        getCourses: async function (_: undefined, __: {}, context: any) {
            const token: string = context.req.headers;
            const user = JWT.verify(token) as IUser;
            const courses: ICourse[] = await CourseService.getCourses();

            return courses;
        },

        getMyCourses: async function (_: undefined, __: {}, context: any) {
            const token: string = context.req.headers;
            const user = JWT.verify(token) as IUser;

            return 
        }
    },
    Mutation: {

    },
}