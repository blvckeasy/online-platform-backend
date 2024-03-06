import { BaseContext } from "@apollo/server";
import { CourseRatingService } from "../../../services/course-rating.service";
import ErrorHandler from "../../../utils/error-handler";
import {
	ICourseRating,
	IGetCourseRating,
} from "../../../interfaces/course-rating.interface";


export const courseThemeResolver: BaseContext = {
	Query: {},
	Mutation: {
		getCourseRating: async (
			_: any,
			{
				getCourseRatingInput,
			}: { getCourseRatingInput: IGetCourseRating },
			context: any
		): Promise<ICourseRating | Error> => {
			try {
				const foundedCourseRating = await CourseRatingService.getOne(
					getCourseRatingInput
				);

				return foundedCourseRating;
			} catch (error) {
				await ErrorHandler(error);
			}
		},
	},
};
