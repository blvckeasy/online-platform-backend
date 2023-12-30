import { authResvoler } from "./main/auth.resolver";
import { CourseThemeResolver } from "./main/course-theme.resolver";
import { CourseVideoResolver } from "./main/course-video.resolver";
import { CourseResolver } from "./main/course.resolver";
import { FaqResolver } from "./main/faq.resolver";
import { userResolver } from "./main/user.resolver";


export default [
    userResolver,
    authResvoler,
    CourseResolver,
    CourseThemeResolver,
    CourseVideoResolver,
    FaqResolver,
]