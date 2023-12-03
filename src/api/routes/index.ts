import { Express } from 'express';
import courseVideoRoute from './main/course-video.route';


export default async function Routes (app: Express) {
	return new Promise((resolve) => {
		app.use(`/api/v1` + courseVideoRoute.path, courseVideoRoute.router);

		return resolve(200);
	})
}