import { BaseContext } from "@apollo/server";
import { IUser } from "../../interfaces/user.interface";
import JWT from "../../utils/jwt";
import { ICourse, IGetCourse } from "../../interfaces/course.interface";
import { CourseService } from "../../services/course.service";

export const CourseResolver: BaseContext = {
    Query: {
        getCourses: async function (_: undefined, __: {}, context: any) {
            const token: string = context.req.headers;
            const user = JWT.verify(token) as IUser;
            const courses: ICourse[] = await CourseService.getCourses();

            return courses;
        },
    },
    Mutation: {
        getCourse: async function (_: undefined, { getCourseInput }: { getCourseInput: IGetCourse }, context: any ): Promise<ICourse[]> {
            const course = await CourseService.getCourse(getCourseInput);
            return course;
        }
    },
}