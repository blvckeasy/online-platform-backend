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
import UserProfileAvatarModel from "./userProfileAvatar.model";

export default function initModels () {
    new UserModel();
    new OTPModel();
    new UserProfileAvatarModel();
}