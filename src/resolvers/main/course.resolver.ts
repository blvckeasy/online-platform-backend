import { BaseContext } from "@apollo/server";
import { IUser } from "../../interfaces/user.interface";
import JWT from "../../utils/jwt";
import { ICourse, IGetCourse } from "../../interfaces/course.interface";
import { CourseService } from "../../services/course.service";

export const CourseResolver: BaseContext = {
    Query: {
        getCourses: async function (_: undefined, __: {}, context: any) {
            const { page, limit } = context.req.query;
            const courses: ICourse[] = await CourseService.getCourses({ page, limit });

            return courses;
        },
    },
    Mutation: {
        getCourse: async function (_: undefined, { getCourseInput }: { getCourseInput: IGetCourse }, context: any ): Promise<ICourse[]> {
            const { page, limit } = context.req.query;
            const course = await CourseService.getCourse(getCourseInput, { page, limit });
            return course;
        }
    },
}