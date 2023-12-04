import { NextFunction, Request, Response } from "express";
import { FILE } from "../../utils/file";
import JWT from "../../utils/jwt";
import { BadGatewayExcaption, NotFoundException } from "../../utils/errors";
import { ICourseVideo } from "../../interfaces/course-video.interface";
import { IUser } from "../../interfaces/user.interface";
import { ICourseTheme } from "../../interfaces/course-theme.interface";
import { ErrorTypes } from "../../utils/error-handler";
import { CourseVideoService } from "../../services/course-video.service";
import { CourseThemeService } from "../../services/course-theme.service";
import { ICourse } from "../../interfaces/course.interface";
import { CourseService } from "../../services/course.service";


export default class CourseVideoController {
    async createCourseVideo (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { thumbnail: [thumbnail], video: [video] } = req.files as { [fieldname: string]: Express.Multer.File[]; }
            const token = req.headers["token"] as string;
            const { title, theme_id }: { title: string, theme_id: number } = req.body;
            
            const user = JWT.verify(token) as IUser;

            const foundTheme: ICourseTheme = (await CourseThemeService.getCourseThemes({ id: theme_id }))[0];
            if (!foundTheme) throw new NotFoundException("Theme is not found!", ErrorTypes.NOT_FOUND);

            const foundCourse: ICourse = (await CourseService.getSearchCourses({ id: foundTheme.course_id }))[0];
            if (!foundCourse) throw new NotFoundException("Course is not found!", ErrorTypes.NOT_FOUND);

            if (foundCourse.user_id != user.id) throw new BadGatewayExcaption("It is not in your power to edit this video!", ErrorTypes.BAD_REQUEST);

            const videoName: string = await FILE.writeFile(video.originalname, video.buffer);
            const thumbnailName: string = await FILE.writeFile(thumbnail.originalname, thumbnail.buffer);

            const newCourseVideo: ICourseVideo = await CourseVideoService.postCourseVideo({
                thumbnail_url: thumbnailName,
                video_url: videoName,
                theme_id, 
                title,
            })

            res.status(200).send(newCourseVideo);
        } catch (error) {
            next(error);
        }
    }
}