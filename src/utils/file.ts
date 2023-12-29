import Path from 'path';
import Fs from 'fs';
import { generateFileName } from './generate-filename';
import { google, drive_v3 } from 'googleapis';
import googleApiKey from '../../googleApiKey.json';
import JWT from './jwt';
import { InternalServerError } from './errors';
import { ErrorTypes } from './error-handler';
import { IGoogleDriveUploadResponse } from '../interfaces/config.interface';

enum EFileType {
    'image' = 'images',
    'video' = 'videos',
}

type TFileType = "image" | "video"; 

export class FILE {
    static async writeFile (originalName: string, buffer: Buffer, type: TFileType): Promise<string> {
        const fileName = await generateFileName(originalName);
        const writer = Fs.createWriteStream(Path.join(process.cwd(), "uploads", EFileType[type], fileName), {
            flags: "w",
        });

        writer.write(buffer);
        return fileName;
    }
}

const SCOPE = ["https://www.googleapis.com/auth/drive"];

export class GoogleDrive {
    private jwtClient: JWT;

    constructor () {
        this.authorize();
    }

    private async authorize (): Promise<JWT> {
        const jwtClient = new google.auth.JWT(
            googleApiKey.client_email, 
            null, 
            googleApiKey.private_key, 
            SCOPE
        );

        await jwtClient.authorize()

        this.jwtClient = jwtClient;

        return jwtClient;
    }

    async uploadFile (FILE: Express.Multer.File, type: TFileType): Promise<IGoogleDriveUploadResponse> {
        const { originalname, mimetype, buffer } = FILE;
        
        return new Promise((resolve, reject) => {
            if (!this.jwtClient) {
                throw new InternalServerError("jwtClient is not found!", ErrorTypes.INTERNAL_SERVER_ERROR);
            }
            const drive = google.drive({ version: 'v3', auth: this.jwtClient as string })

            var fileMetaData = {
                name: originalname,
                parents: ["1BZQh9YLTB56ACjtDAJ7KtUISHZD-t4SL"],
            }

            drive.files.create({
                media: {
                    body: buffer,
                    mimeType: mimetype,
                },
                requestBody: fileMetaData as drive_v3.Schema$File,
                fields: 'id'
            }, function (error, file) {
                if (error) {
                    return reject({
                        error
                    });
                }
                resolve({
                    id: file.data.id,
                });
            })
        })
    }
}