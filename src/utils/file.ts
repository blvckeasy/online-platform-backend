import { google, drive_v3, GoogleApis } from 'googleapis';
import { Readable } from 'stream';
import { Request } from 'express';
import Path from 'path';
import Fs from 'fs';
import { generateFileName } from './generate-filename';
import { InternalServerError, NotFoundException } from './errors';
import { ErrorTypes } from './error-handler';
import { GlobalExpressMulterFile, IGoogleDriveUploadResponse } from '../interfaces/config.interface';
import dateFormat from './date-format'
import { ConfigService } from '../config/config.service';
import { IGoogleApiKey } from '../interfaces/google-keys.interface';


enum EFileType {
    'image' = 'images',
    'video' = 'videos',
}
type TFileType = "image" | "video";
let googleAuth = (new GoogleApis()).oauth2("v2").google.auth

const GOOGLE_API_KEY = ConfigService.get("googleApiKey") as IGoogleApiKey
// const jwtClient = new googleAuth.JWT(GOOGLE_API_KEY.client_email, null, GOOGLE_API_KEY.private_key, ["https://www.googleapis.com/auth/drive"])


export class FILE {
    static async writeFile(originalName: string, buffer: Buffer, type: TFileType): Promise<string> {
        const fileName = await generateFileName(originalName);
        const writer = Fs.createWriteStream(Path.join(process.cwd(), "uploads", EFileType[type], fileName), {
            flags: "w",
        });

        writer.write(buffer);
        return fileName;
    }

    static writeErrorFile(error: Error, req: Request): void {
        const data: string =
            `method: \"${req.method}\"
url: \"${req.url}\"
date: \"${new Date()}\"
error: \"${error}\"
body: \"(${JSON.stringify(req.body || "", null, 4)})\"
----------------------------------------------------------------------------------------
`
        Fs.appendFileSync(Path.join(process.cwd(), 'logs', `${dateFormat()}.log`), data)
    }
}


export class GoogleDrive {
    private jwtClient: any;
    private SCOPE: string[] = ["https://www.googleapis.com/auth/drive"];
    private GOOGLE_API_KEY = ConfigService.get("googleApiKey") as IGoogleApiKey


    private async authorize(): Promise<any> { // Promise<anyAuth.JWT>
        try {
            const jwtClient = new googleAuth.JWT(
                GOOGLE_API_KEY.client_email,
                null,
                GOOGLE_API_KEY.private_key,
                ["https://www.googleapis.com/auth/drive"]
            );

            await jwtClient.authorize();
            this.jwtClient = jwtClient;

            return jwtClient;
        } catch (error) {
            throw new InternalServerError(error, ErrorTypes.INTERNAL_SERVER_ERROR);
        }
    }

    async uploadFile(FILE: GlobalExpressMulterFile, type: TFileType): Promise<IGoogleDriveUploadResponse> {
        try {
            await this.authorize()

            if (!this.jwtClient) {
                throw new InternalServerError("jwtClient is not found!", ErrorTypes.INTERNAL_SERVER_ERROR);
            }

            const drive = google.drive({ version: 'v3', auth: this.jwtClient })
            const { originalname, mimetype, buffer } = FILE;
            const fileMetaData = {
                name: originalname,
                parents: ["1BZQh9YLTB56ACjtDAJ7KtUISHZD-t4SL"],
            }

            const bufferStream = new Readable()
            bufferStream.push(buffer);
            bufferStream.push(null);

            drive.files.create()

            const data = await drive.files.create({
                media: {
                    body: bufferStream,
                    // mimeType: mimetype,
                },
                requestBody: fileMetaData as drive_v3.Schema$File,
                // fields: 'id',
            }, {
                onUploadProgress: function (data) {
                    // progress control
                },
            });
            console.log(data);
            return data as any | IGoogleDriveUploadResponse;
        } catch (error) {
            throw new InternalServerError(error, ErrorTypes.INTERNAL_SERVER_ERROR);
        }
    }

    async getFile(fileID: string) {
        await this.authorize();

        const drive = google.drive({ version: 'v3', auth: this.jwtClient })

        const data = await new Promise((resolve, reject) => {
            drive.files.get({
                fileId: fileID,
                // alt: 'media',
                // fields: 'size',
                // supportsAllDrives: true,
            }, {
                responseType: 'stream',
            }, (err, event) => {
                if (err) {
                    return reject(new NotFoundException(JSON.parse(err.message).error.message, ErrorTypes.NOT_FOUND));
                }
                const data = event.data
                resolve(data);
            })
        })
        return data;
    }
}