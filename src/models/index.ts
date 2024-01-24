// import Fs from 'fs';
// import { join } from 'path';


// export default async function initModels () {
//     const regex: RegExp = /.+\.model\.(ts|js)$/;
//     const dirs: string[] = Fs.readdirSync(join(__dirname));
//     const files: string[] = dirs.filter((value: string) => {
//         return regex.test(value);
//     })

//     console.log(files);

//     for await (let fileName of files) {
//         const filePath = join(__dirname, fileName);
//         const { default: model } = await import(filePath);

//         new model()
//     }
// }

import UserModel from "./user.model";
import OTPModel from "./otp.model";
import UserProfileAvatarModel from "./user-profile-avatar.model";
import UsersQueueModel from "./users-queue.model";
import CoursesModel from "./courses.model";
import CourseThemesModel from "./course-themes.model";
import CourseVideosModel from "./course-videos.model";
import FAQModel from "./faq.model";
import UserActivitiesModel from "./user-activities.model";

export default function initModels () {
    new UserModel();
    new OTPModel();
    new UserProfileAvatarModel();
    new UsersQueueModel();
    new UserActivitiesModel();
    new CoursesModel();
    new CourseThemesModel();
    new CourseVideosModel();
    new FAQModel();
}