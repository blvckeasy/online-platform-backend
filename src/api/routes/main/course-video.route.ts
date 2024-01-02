import { Router, Request, Response, NextFunction } from 'express';
import Multer from 'multer';
import CourseVideoController from '../../controllers/course-video.controller';

const courseVideoRouter = Router()
const upload = Multer()

const courseVideoController = new CourseVideoController();

courseVideoRouter
    .post("/upload", upload.single('video'), courseVideoController.createCourseVideo.bind(courseVideoController))
    .post('/upload-video/alreadyHaveCourse', upload.single('video'), courseVideoController.uploadVideoToAlreadyHaveCourseVideo.bind(courseVideoController))
    .get("/:fileId", courseVideoController.getFile.bind(courseVideoController))

export default {
    path: "/course-video",
    router: courseVideoRouter
}