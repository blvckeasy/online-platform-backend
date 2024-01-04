import { Router, Request, Response, NextFunction } from 'express';
import * as Multer from 'Multer';
import CourseVideoController from '../../controllers/course-video.controller';

const courseVideoRouter = Router()
const courseVideoController = new CourseVideoController();

const storage = Multer.memoryStorage()
const upload = Multer.default({ storage })


courseVideoRouter
    .post("/upload", upload.single('video'), courseVideoController.createCourseVideo.bind(courseVideoController))
    .post('/upload-video/alreadyHaveCourse', upload.single('video'), courseVideoController.uploadVideoToAlreadyHaveCourseVideo.bind(courseVideoController))
    .get("/:fileId", courseVideoController.getFile.bind(courseVideoController))

export default {
    path: "/course-video",
    router: courseVideoRouter
}