import { NextFunction, Request, Response } from "express";
import { ErrorTypes } from "../../utils/error-handler";
import { GoogleDrive } from "../../utils/file";
import JWT from "../../utils/jwt";
import {
    BadGatewayExcaption,
    BadRequestExcaption,
    InvalidTokenException,
    NotFoundException,
    UnauthorizedExcaption
} from "../../utils/errors";
import { ICourseVideo } from "../../interfaces/course-video.interface";
import { IParsedAccessToken } from "../../interfaces/jwt.interface";
import { IUser } from "../../interfaces/user.interface";
import { ICourse } from "../../interfaces/course.interface";
import { ICourseTheme } from "../../interfaces/course-theme.interface";
import { CourseVideoService } from "../../services/course-video.service";
import { CourseThemeService } from "../../services/course-theme.service";
import { CourseService } from "../../services/course.service";
import { UserService } from "../../services/user.service";


export default class CourseVideoController {
    private googleDrive: GoogleDrive    

    constructor () {
        this.googleDrive = new GoogleDrive();
    }

    async uploadVideoToAlreadyHaveCourseVideo (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const video: Express.Multer.File = req.file;
            const { video_id } = req.body;
            const token = req.headers.token as string;

            const parsedToken = JWT.verify(token) as IParsedAccessToken;
            if (!parsedToken) throw new InvalidTokenException("Invalid token!", ErrorTypes.INVALID_TOKEN);

            const foundUser = await UserService.findOne({ id: parsedToken.id });
            if (!foundUser) throw new UnauthorizedExcaption("User is unauthorized", ErrorTypes.BAD_USER_INPUT);

            const foundCourseVideo = await CourseVideoService.getCourseVideo({ id: video_id });
            if (!foundCourseVideo) throw new NotFoundException("course video is not found!", ErrorTypes.NOT_FOUND);

            const { id: google_drive_video_id } = await this.googleDrive.uploadFile(video, "video");
            const updatedCourseVideo = await CourseVideoService.updateCourseVideo({ course_video_id: video_id, google_drive_video_id });

            res.status(200).send(updatedCourseVideo);
        } catch (error) {
            next(error);
        }
    }

    async createCourseVideo (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const video: Express.Multer.File = req.file
            if (!video) throw new NotFoundException("Video is require!", ErrorTypes.NOT_FOUND);
            
            const { title, description, theme_id } = req.body;
            const token = req.headers["token"] as string;
            
            const user = JWT.verify(token) as IUser;
            if (!user) throw new InvalidTokenException("Invalid token!", ErrorTypes.INVALID_TOKEN);

            const foundUser: IUser = (await UserService.findOne({ id: user.id }));
            if (!foundUser) throw new NotFoundException("User not found", ErrorTypes.NOT_FOUND);
            if (!["admin", "teacher"].includes(foundUser.role)) throw new BadRequestExcaption("You are not uploaded course!", ErrorTypes.BAD_REQUEST);

            const foundTheme: ICourseTheme = (await CourseThemeService.getCourseThemes({ id: theme_id }))[0];
            if (!foundTheme) throw new NotFoundException("Theme is not found!", ErrorTypes.NOT_FOUND);

            const foundCourse: ICourse = (await CourseService.getSearchCourses({ id: foundTheme.course_id }))[0];
            if (!foundCourse) throw new NotFoundException("Course is not found!", ErrorTypes.NOT_FOUND);

            if (foundCourse.user_id != foundUser.id) throw new BadGatewayExcaption("It is not in your power to edit this video!", ErrorTypes.BAD_REQUEST);

            const { id: google_drive_video_id } = await this.googleDrive.uploadFile(video, "video")
            const newCourseVideo: ICourseVideo = await CourseVideoService.postCourseVideo({
                google_drive_video_id,
                theme_id, 
                title,
                description
            })

            res.status(200).send(newCourseVideo);
        } catch (error) {
            next(error);
        }
    }

    async getFile (req: Request, res: Response, next: NextFunction) {
        try {
            const { fileId } = req.params;
            const data: any = await this.googleDrive.getFile(fileId);
        
            data.pipe(res);
        } catch (error) {
            next(error);
        }
    }
}