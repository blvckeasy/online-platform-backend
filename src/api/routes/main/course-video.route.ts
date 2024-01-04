import { Router, Request, Response, NextFunction } from 'express';
import multer from 'Multer';
import CourseVideoController from '../../controllers/course-video.controller';

const courseVideoRouter = Router()
const courseVideoController = new CourseVideoController();

const upload = multer()

courseVideoRouter
    .post("/upload", upload.single('video'), courseVideoController.createCourseVideo.bind(courseVideoController))
    .post('/upload-video/alreadyHaveCourse', upload.single('video'), courseVideoController.uploadVideoToAlreadyHaveCourseVideo.bind(courseVideoController))
    .get("/:fileId", courseVideoController.getFile.bind(courseVideoController))

export default {
    path: "/course-video",
    router: courseVideoRouter
}