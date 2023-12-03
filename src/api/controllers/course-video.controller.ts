import { NextFunction, Request, Response } from "express";
import { FILE } from "../../utils/file";
import JWT from "../../utils/jwt";

export default class CourseVideoController {
    async createCourseVideo (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { thumbnail: [thumbnail], video: [video] } = req.files as { [fieldname: string]: Express.Multer.File[]; }
            const token = req.headers["access_token"] as string;
    
            const user = JWT.verify(token);
    
            const videoName: string = await FILE.writeFile(video.originalname, video.buffer);
            const thumbnailName: string = await FILE.writeFile(thumbnail.originalname, thumbnail.buffer);
            
            console.log(videoName);
            console.log(thumbnailName);
        } catch (error) {
            next(error);
        }
    }
}