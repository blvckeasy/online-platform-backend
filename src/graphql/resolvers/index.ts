import { authResvoler } from "./main/auth.resolver";
import { courseThemeResolver } from "./main/course-theme.resolver";
import { courseVideoResolver } from "./main/course-video.resolver";
import { courseResolver } from "./main/course.resolver";
import { faqResolver } from "./main/faq.resolver";
import { userActivitiesResolver } from "./main/user-activities.resolver";
import { userResolver } from "./main/user.resolver";


export default [
    userResolver,
    authResvoler,
    courseResolver,
    courseThemeResolver,
    courseVideoResolver,
    faqResolver,
    userActivitiesResolver,
]