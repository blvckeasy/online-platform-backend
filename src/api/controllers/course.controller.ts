import { Request, Response, NextFunction } from "express";
import JWT from "../../utils/jwt";
import { UserService } from "../../services/user.service";
import { IUser } from "../../interfaces/user.interface";
import { BadGatewayExcaption, NotFoundException } from "../../utils/errors";
import { ErrorTypes } from "../../utils/error-handler";
import { generateFileName } from "../../utils/generate-filename";
import { CourseService } from "../../services/course.service";
import { ICourse } from "../../interfaces/course.interface";
import { FILE } from "../../utils/file";


export default class CourseController {
    async createCourse (req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const file = req.file;
            const { title, price } = req.body;
            const token = req.headers.token as string

            const user = JWT.verify(token) as IUser;
            if (!user) throw new NotFoundException("Invalid token excaption!", ErrorTypes.NOT_FOUND);

            const foundUser = await UserService.findOneWithID(user.id);
            if (!foundUser) throw new NotFoundException("User is not found!", ErrorTypes.NOT_FOUND);
            
            if (!["admin", "teacher"].includes(foundUser.role)) throw new BadGatewayExcaption("Only teacher or admin can be upload course", ErrorTypes.BAD_REQUEST);

            const thumbnail_url: string = await FILE.writeFile(file.originalname, file.buffer);
            const newCourse: ICourse = await CourseService.createCourse(foundUser.id, { title, price, thumbnail_url });

            return res.status(201).send({
                course: newCourse,
            })
        } catch (error) {
            next(error);
        }
    }
}