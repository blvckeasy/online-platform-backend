import { Express } from 'express';
import courseVideoRoute from './main/course-video.route';
import courseRoute from './main/course.route';


export default async function Routes (app: Express) {
	return new Promise((resolve) => {
		app.use(`/api/v1` + courseVideoRoute.path, courseVideoRoute.router);
		app.use(`/api/v1` + courseRoute.path, courseRoute.router);

		return resolve(200);
	})
}