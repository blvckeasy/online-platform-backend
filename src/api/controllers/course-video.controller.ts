import { NextFunction, Request, Response } from "express";
import { GoogleDrive } from "../../utils/file";
import JWT from "../../utils/jwt";
import { BadGatewayExcaption, BadRequestExcaption, NotFoundException } from "../../utils/errors";
import { ICourseVideo } from "../../interfaces/course-video.interface";
import { IUser } from "../../interfaces/user.interface";
import { ICourseTheme } from "../../interfaces/course-theme.interface";
import { ErrorTypes } from "../../utils/error-handler";
import { CourseVideoService } from "../../services/course-video.service";
import { CourseThemeService } from "../../services/course-theme.service";
import { ICourse } from "../../interfaces/course.interface";
import { CourseService } from "../../services/course.service";
import { UserService } from "../../services/user.service";


export default class CourseVideoController {
    private googleDrive: GoogleDrive    

    constructor () {
        this.googleDrive = new GoogleDrive();
    }

    async createCourseVideo (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const video: Express.Multer.File = req.file
            const { title, description, theme_id } = req.body;

            const token = req.headers["token"] as string;
            
            if (!video) throw new NotFoundException("Video is require!", ErrorTypes.NOT_FOUND);
            const user = JWT.verify(token) as IUser;

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
        const { fileId } = req.params;

        const status = await this.googleDrive.getFile(fileId, res, next);
    }
}