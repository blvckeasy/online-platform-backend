import {
	ICourseRating,
	ICreateCourseRating,
	IGetCourseRating,
	IUpdateCourseRating,
} from "../interfaces/course-rating.interface";
import { client } from "../utils/pg";


export class CourseRatingService {
    /**
     * 
     * @param getCourseRatingInput 
     * @returns 
     */
	static async getOne(
		getCourseRatingInput: IGetCourseRating
	): Promise<ICourseRating | Error> {
		const { course_id } = getCourseRatingInput;

		const foundedCourseRating = (
			await client.query(
				`
                    SELECT * FROM courses_ratings WHERE course_id = $1;
                `,
				[course_id]
			)
		).rows as ICourseRating[];

		const rating: ICourseRating = {
			id: foundedCourseRating[0].id,
			course_id: foundedCourseRating[0].course_id,
			rating: foundedCourseRating.reduce(
				(sum: number, courseRating: ICourseRating) => {
					return sum + courseRating.rating;
				},
				0
			),
		};

		return rating;
	}


    /**
     * 
     * @param createCourseRatingInput 
     * @returns 
     */
	static async create(
		createCourseRatingInput: ICreateCourseRating
	): Promise<ICourseRating | Error> {
		const { user_id, course_id, rating } = createCourseRatingInput;

		const newCourseRating = (
			await client.query(
				`
                    INSERT INTO courses_ratings 
                        (USER_ID, COURSE_ID, RATING) VALUES ($1, $2, $3) RETURNING *;
                `,
				[user_id, course_id, rating]
			)
		).rows[0] as ICourseRating;

		return newCourseRating;
	}


    /**
     * 
     * @param updateCourseRatingInput 
     * @returns 
     */
	static async update(
		updateCourseRatingInput: IUpdateCourseRating
	): Promise<ICourseRating | Error> {
		const { course_id, rating, user_id } = updateCourseRatingInput;

		const updatedCourseRating = (
			await client.query(
				`
                    UPDATE courses_ratings
                    SET
                        RATING = %3
                    WHERE
                        COURSE_ID = $1 AND USER_ID = $2
                    RETURNING *;
                `,
				[course_id, user_id, rating]
			)
		).rows[0] as ICourseRating;

		return updatedCourseRating;
	}
}
