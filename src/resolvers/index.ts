import { authResvoler } from "./main/auth.resolver";
import { CourseResolver } from "./main/course.resolver";
import { userResolver } from "./main/user.resolver";


export default [
    userResolver,
    authResvoler,
    CourseResolver,
]