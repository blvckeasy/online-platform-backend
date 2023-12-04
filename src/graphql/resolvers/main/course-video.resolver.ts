import { BaseContext } from "@apollo/server";
import { IDeleteCourseVideoInput, IGetCourseVideosInput, IUpdateCourseVideoInput } from "../../../interfaces/course-video.interface";
import { ICourseVideo } from "../../../interfaces/course-video.interface";
import { CourseVideoService } from "../../../services/course-video.service";
import ErrorHandler, { ErrorTypes } from "../../../utils/error-handler";
import JWT from "../../../utils/jwt";
import { BadGatewayExcaption, NotFoundException } from "../../../utils/errors";
import { ICourseTheme } from "../../../interfaces/course-theme.interface";
import { CourseThemeService } from "../../../services/course-theme.service";
import { CourseService } from "../../../services/course.service";
import { ICourse } from "../../../interfaces/course.interface";
import { IUser } from "../../../interfaces/user.interface";
import { UserService } from "../../../services/user.service";


export const CourseVideoResolver: BaseContext = {
    Query: {},
    Mutation: {
        async getCourseVideos (_: any, { getCourseVideosInput }: { getCourseVideosInput: IGetCourseVideosInput }, context: any): Promise<ICourseVideo[]> {            
            try {
                const courseVideos: ICourseVideo[] = await CourseVideoService.getCourseVideos(getCourseVideosInput)
                return courseVideos;
            } catch (error) {
                throw await ErrorHandler(error);
            }
        },
        async updateCourseVideo (parent: any, { updateCourseVideoInput }: { updateCourseVideoInput: IUpdateCourseVideoInput }, context: any): Promise<ICourseVideo> {
            try {
                const token: string = context.req.headers.token;
                const user = JWT.verify(token) as IUser;
                
                const foundUser: IUser = (await UserService.findOne({ id: user.id }));
                if (!foundUser) throw new NotFoundException("User not found", ErrorTypes.NOT_FOUND);

                const foundCourseVideo: ICourseVideo = (await CourseVideoService.getCourseVideos({ id: updateCourseVideoInput.course_video_id }))[0];
                if (!foundCourseVideo) throw new NotFoundException("Video is not found!", ErrorTypes.NOT_FOUND);

                const foundCourseTheme: ICourseTheme = (await CourseThemeService.getCourseThemes({ id: foundCourseVideo.theme_id }))[0];
                if (!foundCourseTheme) throw new NotFoundException("Video theme is not found!", ErrorTypes.NOT_FOUND);

                const foundCourse: ICourse = (await CourseService.getSearchCourses({ id: foundCourseTheme.course_id }))[0];
                if (!foundCourse) throw new NotFoundException("Course is not found!", ErrorTypes.NOT_FOUND);

                if (foundCourse.user_id != user.id) throw new BadGatewayExcaption("It is not in your power to edit this video!", ErrorTypes.BAD_REQUEST);

                const updatedCourseVideo: ICourseVideo = await CourseVideoService.updateCourseVideo(updateCourseVideoInput);
                return updatedCourseVideo;
            } catch (error) {
                throw await ErrorHandler(error);
            }
        },
        async deleteCourseVideo (parent: any, { deleteCourseVideoInput }: { deleteCourseVideoInput: IDeleteCourseVideoInput }, context: any): Promise<ICourseVideo> {
            try {
                const token: string = context.req.headers.token;
                const user = JWT.verify(token) as IUser;

                const foundUser: IUser = (await UserService.findOne({ id: user.id }));
                if (!foundUser) throw new NotFoundException("User not found", ErrorTypes.NOT_FOUND);

                const foundCourseVideo: ICourseVideo = (await CourseVideoService.getCourseVideos({ id: deleteCourseVideoInput.id }))[0];
                if (!foundCourseVideo) throw new NotFoundException("Video is not found!", ErrorTypes.NOT_FOUND);

                const foundCourseTheme: ICourseTheme = (await CourseThemeService.getCourseThemes({ id: foundCourseVideo.theme_id }))[0];
                if (!foundCourseTheme) throw new NotFoundException("Video theme is not found!", ErrorTypes.NOT_FOUND);

                const foundCourse: ICourse = (await CourseService.getSearchCourses({ id: foundCourseTheme.course_id }))[0];
                if (!foundCourse) throw new NotFoundException("Course is not found!", ErrorTypes.NOT_FOUND);

                if (foundCourse.user_id != user.id) throw new BadGatewayExcaption("It is not in your power to edit this video!", ErrorTypes.BAD_REQUEST);

                const deletedCourseVideo: ICourseVideo = await CourseVideoService.deleteCourseVideo(deleteCourseVideoInput);
                return deletedCourseVideo;
            } catch (error) {
                throw await ErrorHandler(error);
            }
        }
    },
}