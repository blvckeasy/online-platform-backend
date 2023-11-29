import { authTypeDef } from "./main/auth.schema";
import { courseTypeDef } from "./main/course.schema";
import { userTypeDef } from "../services/user.schema";


export default [
    userTypeDef,
    authTypeDef,
    courseTypeDef,
]