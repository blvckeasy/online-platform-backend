import { Router } from "express";
import * as Multer from 'Multer';
import CourseController from "../../controllers/course.controller";

const CourseRouter = Router()
const courseController = new CourseController();

const storage = Multer.memoryStorage()
const upload = Multer.default({ storage })

CourseRouter
    .post("/create", upload.single('thumbnail'), courseController.createCourse.bind(courseController))


export default {
    path: "/course",
    router: CourseRouter,
}