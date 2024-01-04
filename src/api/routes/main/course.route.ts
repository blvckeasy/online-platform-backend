import { Router } from "express";
import Multer from 'Multer';
import CourseController from "../../controllers/course.controller";

const CourseRouter = Router()
const upload = Multer()
const courseController = new CourseController();

CourseRouter
    .post("/create", upload.single('thumbnail'), courseController.createCourse.bind(courseController))


export default {
    path: "/course",
    router: CourseRouter,
}