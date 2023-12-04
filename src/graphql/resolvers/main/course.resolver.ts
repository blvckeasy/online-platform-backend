import { BaseContext } from "@apollo/server";
import { ICourse, ICourseWithUser, IGetCourse, IGetCourseResponse } from "../../../interfaces/course.interface";
import { CourseService } from "../../../services/course.service";
import { CourseThemeService } from "../../../services/course-theme.service";
import { NotFoundException } from "../../../utils/errors";
import ErrorHandler, { ErrorTypes } from "../../../utils/error-handler";
import { IPagination } from "../../../interfaces/config.interface";
import { ICourseThemeWithVideos } from "../../../interfaces/course-theme.interface";
import { CourseVideoService } from "../../../services/course-video.service";
import { UserService } from "../../../services/user.service";
import { IUser } from "../../../interfaces/user.interface";


export const CourseResolver: BaseContext = {
    Query: {
        getCourses: async function (_: undefined, __: {}, context: any): Promise<ICourseWithUser[]> {
            try {
                const courseWithUser: ICourseWithUser[] = [];
            
                const { page, limit } = context.req.query;
                const courses: ICourse[] = await CourseService.getCourses({ page, limit });
    
                for (const course of courses) {
                    const author: IUser = await UserService.findOne({ id: course.user_id });
                    courseWithUser.push({ course, author } as ICourseWithUser);
                }
    
                return courseWithUser;
            } catch (error) {
                throw await ErrorHandler(error);
            }
        },
    },
    Mutation: {
        getCourse: async function (_: undefined, { getCourseInput }: { getCourseInput: IGetCourse }, context: any ): Promise<IGetCourseResponse> {
            try {
                const { page, limit }: IPagination = context.req.query;
                const course: ICourse = (await CourseService.getSearchCourses(getCourseInput, { page, limit }))[0];
             
                if (!course) throw new NotFoundException("Course is not found!", ErrorTypes.NOT_FOUND);   
                const foundThemes: ICourseThemeWithVideos[] = await CourseThemeService.getCourseThemes({course_id: course.id});
                
                for (const theme of foundThemes) {
                    theme.videos = await CourseVideoService.getCourseVideos({theme_id: theme.id});
                }
    
                return {
                    course,
                    themes: foundThemes,
                } as IGetCourseResponse
            } catch (error) {
                throw await ErrorHandler(error);
            }
        }

    },
}