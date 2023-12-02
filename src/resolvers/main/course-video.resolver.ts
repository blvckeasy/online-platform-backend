import { BaseContext } from "@apollo/server";
import { IGetCourseVideosInput } from "../../interfaces/course-video.interface";
import { ICourseVideo } from "../../interfaces/course-video.interface";
import { CourseVideoService } from "../../services/course-video.service";
import JWT from "../../utils/jwt";


export const CourseVideoResolver: BaseContext = {
    Query: {},
    Mutation: {
        async createCourseVideo (_: any, { createCourseVideoInput }, context: any) {
            const { token } = context.req.headers;
            const user = JWT.verify(token);

            
        },
        async getCourseVideos (_: any, { getCourseVideosInput }: { getCourseVideosInput: IGetCourseVideosInput }, context: any) {            
            const courseVideos: ICourseVideo[] = await CourseVideoService.getCourseVideos(getCourseVideosInput)
            return courseVideos;
        }
    },
}