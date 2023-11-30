import { BaseContext } from "@apollo/server";
import { ICourseTheme, IGetCourseThemeInput } from "../../interfaces/course-theme.interface";
import { CourseThemeService } from "../../services/course-theme.service";

export const CourseThemeResolver: BaseContext = {
    Query: {},
    Mutation: {
        getCourseThemes: async (_: any, { getCourseThemeInput }: { getCourseThemeInput: IGetCourseThemeInput }, context: any): Promise<ICourseTheme[]> => {
            return await CourseThemeService.getCourseThemes(getCourseThemeInput);
        },
    },
}