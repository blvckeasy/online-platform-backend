import { authTypeDef } from "./main/auth.schema";
import { courseTypeDef } from "./main/course.schema";
import { userTypeDef } from "./main/user.schema";
import { courseThemeTypeDef } from "./main/course-theme.schema";
import { courseVideoTypeDef } from "./main/course-video.schema";
import { faqTypeDef } from "./main/faq.schme";
import { userActivitiesTypeDef } from "./main/user-activities.schema";
import { courseRatingTypeDef } from './main/course-rating.schema'


export default [
    userTypeDef,
    authTypeDef,
    courseRatingTypeDef,
    courseTypeDef,
    courseThemeTypeDef,
    courseVideoTypeDef,
    faqTypeDef,
    userActivitiesTypeDef,
]