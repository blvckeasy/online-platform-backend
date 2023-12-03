import { BaseContext } from "@apollo/server";
import { ICourseTheme, ICreateCourseThemeInput, IGetCourseThemeInput } from "../../../interfaces/course-theme.interface";
import { CourseThemeService } from "../../../services/course-theme.service";
import JWT from "../../../utils/jwt";
import { BadRequestExcaption, NotFoundException } from "../../../utils/errors";
import ErrorHandler, { ErrorTypes } from "../../../utils/error-handler";
import { CourseService } from "../../../services/course.service";
import { ICourse } from "../../../interfaces/course.interface";
import { IUser } from "../../../interfaces/user.interface";


export const CourseThemeResolver: BaseContext = {
    Query: {},
    Mutation: {
        createCourseTheme: async (_: any, { createCourseThemeInput }: { createCourseThemeInput: ICreateCourseThemeInput }, context: any): Promise<ICourseTheme> => {
            try {
                const { token } = context.req.headers;
                if (!token) throw new NotFoundException("token is require!", ErrorTypes.INVALID_TOKEN);
    
                const user: IUser = JWT.verify(token) as IUser;
                const course: ICourse = (await CourseService.getCourse({ id: createCourseThemeInput.course_id }))[0];
    
                if (course?.user_id != user.id) throw new BadRequestExcaption("You do not have permission to change this course!", ErrorTypes.BAD_REQUEST)
    
                const newCourseTheme: ICourseTheme = await CourseThemeService.createCourseTheme(createCourseThemeInput);
                return newCourseTheme;
            } catch (error) {
                throw await ErrorHandler(error);
            }
        },
        getCourseThemes: async (_: any, { getCourseThemeInput }: { getCourseThemeInput: IGetCourseThemeInput }, context: any): Promise<ICourseTheme[]> => {
            try {
                return await CourseThemeService.getCourseThemes(getCourseThemeInput);
            } catch (error) {
                throw await ErrorHandler(error);
            }
        },
    },
}