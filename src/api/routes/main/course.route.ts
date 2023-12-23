import { Router } from "express";
import Multer from 'multer';
import CourseController from "../../controllers/course.controller";

const CourseRouter = Router()
const upload = Multer()
const courseController = new CourseController();

CourseRouter
    .post("/create", upload.single('thumbnail'), courseController.createCourse);


export default {
    path: "/course",
    router: CourseRouter,
}