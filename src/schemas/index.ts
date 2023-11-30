import { authTypeDef } from "./main/auth.schema";
import { courseTypeDef } from "./main/course.schema";
import { userTypeDef } from "../services/user.schema";
import { courseThemeTypeDef } from "./main/course-theme.schema";
import { courseVideoTypeDef } from "./main/course-video.schema";


export default [
    userTypeDef,
    authTypeDef,
    courseTypeDef,
    courseThemeTypeDef,
    courseVideoTypeDef,
]