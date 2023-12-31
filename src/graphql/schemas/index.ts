import { authTypeDef } from "./main/auth.schema";
import { courseTypeDef } from "./main/course.schema";
import { userTypeDef } from "./main/user.schema";
import { courseThemeTypeDef } from "./main/course-theme.schema";
import { courseVideoTypeDef } from "./main/course-video.schema";
import { faqTypeDef } from "./main/faq.schme";


export default [
    userTypeDef,
    authTypeDef,
    courseTypeDef,
    courseThemeTypeDef,
    courseVideoTypeDef,
    faqTypeDef,
]