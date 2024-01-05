import { Router } from "express";
import multer from 'multer';
import CourseController from "../../controllers/course.controller";

const CourseRouter = Router()
const courseController = new CourseController();

const upload = multer()

CourseRouter
    .post("/create", upload.single('thumbnail'), courseController.createCourse.bind(courseController))


export default {
    path: "/course",
    router: CourseRouter,
}