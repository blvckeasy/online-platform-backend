import { BaseContext } from "@apollo/server";
import { IGetCourseVideosInput } from "../../../interfaces/course-video.interface";
import { ICourseVideo } from "../../../interfaces/course-video.interface";
import { CourseVideoService } from "../../../services/course-video.service";


export const CourseVideoResolver: BaseContext = {
    Query: {},
    Mutation: {
        async getCourseVideos (_: any, { getCourseVideosInput }: { getCourseVideosInput: IGetCourseVideosInput }, context: any) {            
            const courseVideos: ICourseVideo[] = await CourseVideoService.getCourseVideos(getCourseVideosInput)
            return courseVideos;
        }
    },
}