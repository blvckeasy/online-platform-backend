import { BaseContext } from "@apollo/server";
import {
    IDeleteCourseVideoInput,
    IGetCourseVideosInput,
    IUpdateCourseVideoInput,
    IGetCourseVideoInput,
    ICreateCourseVideoWithoutVideo,
    ICourseVideoWithoutVideo,
    IUpdateCourseVideoPositionInput
} from "../../../interfaces/course-video.interface";
import { IParsedAccessToken } from "../../../interfaces/jwt.interface";
import { ICourseTheme } from "../../../interfaces/course-theme.interface";
import { ICourse } from "../../../interfaces/course.interface";
import { IUser } from "../../../interfaces/user.interface";
import { ICourseVideo } from "../../../interfaces/course-video.interface";
import ErrorHandler, { ErrorTypes } from "../../../utils/error-handler";
import JWT from "../../../utils/jwt";
import {
    BadGatewayExcaption,
    InvalidTokenException,
    NotFoundException,
    RequiredParamException,
    UnauthorizedExcaption 
} from "../../../utils/errors";
import { CourseService } from "../../../services/course.service";
import { CourseThemeService } from "../../../services/course-theme.service";
import { UserService } from "../../../services/user.service";
import { CourseVideoService } from "../../../services/course-video.service";


export const courseVideoResolver: BaseContext = {
    Query: {},
    Mutation: {
        async createCourseVideoWithoutVideo(_: any, { createCourseVideoWithoutVideoInput }: { createCourseVideoWithoutVideoInput: ICreateCourseVideoWithoutVideo }, context: any): Promise<ICourseVideoWithoutVideo> {
            try {
                const token: string = context.req.headers.token;
                if (!token) throw new RequiredParamException("Token is require!", ErrorTypes.REQUIRED_PARAM);

                const parsedToken = JWT.verify(token) as IParsedAccessToken;
                if (!parsedToken) throw new InvalidTokenException("Invalid token!", ErrorTypes.INVALID_TOKEN);

                const foundUser = await UserService.findOne({ id: parsedToken.id });
                if (!foundUser) throw new UnauthorizedExcaption("User is unauthorized!", ErrorTypes.BAD_USER_INPUT);
                if (!["teacher"].includes(foundUser.role)) throw new BadGatewayExcaption("Only teacher create course video!", ErrorTypes.BAD_REQUEST); 
                
                const { theme_id } = createCourseVideoWithoutVideoInput;
                const foundTheme = await CourseThemeService.getCourseTheme({ id: theme_id });
                if (!foundTheme) throw new NotFoundException("Course not found!", ErrorTypes.NOT_FOUND);

                const newCourseVideoWithoutVideo: ICourseVideoWithoutVideo = await CourseVideoService.createCourseVideoWithoutVideo(createCourseVideoWithoutVideoInput);
                return newCourseVideoWithoutVideo;
            } catch (error) {
                throw await ErrorHandler(error);
            }
        },
        async getCourseVideo(_: any, { getCourseVideoInput }: { getCourseVideoInput: IGetCourseVideoInput }, context: any): Promise<ICourseVideo> {
            try {
                const courseVideo: ICourseVideo = await CourseVideoService.getCourseVideo(getCourseVideoInput);
                return courseVideo;
            } catch (error) {
                throw await ErrorHandler(error);
            }
        },

        async getCourseVideos(_: any, { getCourseVideosInput }: { getCourseVideosInput: IGetCourseVideosInput }, context: any): Promise<ICourseVideo[]> {
            try {
                const courseVideos: ICourseVideo[] = await CourseVideoService.getCourseVideos(getCourseVideosInput)
                return courseVideos;
            } catch (error) {
                throw await ErrorHandler(error);
            }
        },
        async updateCourseVideo(parent: any, { updateCourseVideoInput }: { updateCourseVideoInput: IUpdateCourseVideoInput }, context: any): Promise<ICourseVideo> {
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
        async updateCourseVideoPosition (
            _: any,
            { updateCourseVideoPositionInput }: { updateCourseVideoPositionInput: IUpdateCourseVideoPositionInput },
            context: any
        ):  Promise<ICourseVideo> {
            try {
                const token: string = context.req.headers.token;
                if (!token) throw new NotFoundException("Token is require!", ErrorTypes.INVALID_TOKEN);

                const user = JWT.verify(token) as IParsedAccessToken;
                
                const foundUser: IUser = await UserService.findOne({ id: user.id })
                if (!foundUser) throw new NotFoundException("User not found!", ErrorTypes.NOT_FOUND);

                const updatedCourseVideo = await CourseVideoService.updateCourseVideoPosition(updateCourseVideoPositionInput);
                return updatedCourseVideo;
            } catch (error) {
                throw await ErrorHandler(error);
            }
        },
        async deleteCourseVideo(parent: any, { deleteCourseVideoInput }: { deleteCourseVideoInput: IDeleteCourseVideoInput }, context: any): Promise<ICourseVideo> {
            try {
                const token: string = context.req.headers.token;
                const user = JWT.verify(token) as IUser;

                const foundUser: IUser = await UserService.findOne({ id: user.id });
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