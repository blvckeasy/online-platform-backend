import { Request, Response, NextFunction } from "express";
import JWT from "../../utils/jwt";
import { UserService } from "../../services/user.service";
import { IUser } from "../../interfaces/user.interface";
import { BadGatewayExcaption, NotFoundException } from "../../utils/errors";
import { ErrorTypes } from "../../utils/error-handler";
import { CourseService } from "../../services/course.service";
import { ICourse } from "../../interfaces/course.interface";
import { GoogleDrive } from "../../utils/file";
import { GlobalExpressMulterFile } from "../../interfaces/config.interface";
import { CourseRatingService } from "../../services/course-rating.service";
import { ICourseRating } from "../../interfaces/course-rating.interface";


export default class CourseController {
	public googleDrive: GoogleDrive;

	/**
	 *
	 */
	constructor() {
		this.googleDrive = new GoogleDrive();
	}

	/**
	 *
	 */
	async createCourse(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response> {
		try {
			const image = (req as any).file as GlobalExpressMulterFile;

			const { title, price, description } = req.body;
			const token = req.headers.token as string;

			const user = JWT.verify(token) as IUser;
			if (!user)
				throw new NotFoundException(
					"Invalid token excaption!",
					ErrorTypes.NOT_FOUND
				);

			const foundUser = await UserService.findOneWithID(user.id);
			if (!foundUser)
				throw new NotFoundException(
					"User is not found!",
					ErrorTypes.NOT_FOUND
				);

			if (!["admin", "teacher"].includes(foundUser.role))
				throw new BadGatewayExcaption(
					"Only teacher or admin can be upload course",
					ErrorTypes.BAD_REQUEST
				);

			const { id: google_drive_thumbnail_id } =
				await this.googleDrive.uploadFile(image, "image");
    
			const newCourse: ICourse = await CourseService.createCourse(
				foundUser.id,
				{ title, price, google_drive_thumbnail_id, description }
			);

            const courseRating = await CourseRatingService.create({
                course_id: newCourse.id,
                rating: 0,
                user_id: newCourse.user_id,
            }) as ICourseRating;

			return res.status(201).send({
				course: newCourse,
                rating: courseRating,
			});
		} catch (error) {
			next(error);
		}
	}
}
