import { BaseContext } from "@apollo/server";
import { ICourse, IGetCourse, IGetCourseResponse } from "../../interfaces/course.interface";
import { CourseService } from "../../services/course.service";
import { CourseThemeService } from "../../services/course-theme.service";
import { NotFoundException } from "../../utils/errors";
import { ErrorTypes } from "../../utils/error-handler";
import { IPagination } from "../../interfaces/config.interface";
import { ICourseTheme, ICourseThemeWithVideos } from "../../interfaces/course-theme.interface";
import { CourseVideoService } from "../../services/course-video.service";
import { ICourseVideo } from "../../interfaces/course-video.interface";


export const CourseResolver: BaseContext = {
    Query: {
        getCourses: async function (_: undefined, __: {}, context: any) {
            const { page, limit } = context.req.query;
            const courses: ICourse[] = await CourseService.getCourses({ page, limit });

            return courses;
        },
    },
    Mutation: {
        getCourse: async function (_: undefined, { getCourseInput }: { getCourseInput: IGetCourse }, context: any ): Promise<IGetCourseResponse> {
            const { page, limit }: IPagination = context.req.query;
            const course: ICourse = (await CourseService.getCourse(getCourseInput, { page, limit }))[0];
         
            if (!course) throw new NotFoundException("Course is not found!", ErrorTypes.NOT_FOUND);   
            const foundThemes: ICourseThemeWithVideos[] = await CourseThemeService.getCourseThemes({course_id: course.id});
            
            for (const theme of foundThemes) {
                theme.videos = await CourseVideoService.getCourseVideos({theme_id: theme.id});
            }

            console.log(course);

            return {
                course,
                themes: foundThemes,
            } as IGetCourseResponse
        }

    },
}