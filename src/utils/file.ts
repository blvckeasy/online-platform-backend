import Path from 'path';
import Fs from 'fs';
import { google, drive_v3, Auth } from 'googleapis';
import { Readable } from 'stream';
import { generateFileName } from './generate-filename';
import googleApiKey from '../../googleApiKey.json';
import { InternalServerError } from './errors';
import { ErrorTypes } from './error-handler';
import { IGoogleDriveUploadResponse } from '../interfaces/config.interface';
import { GaxiosPromise } from 'googleapis/build/src/apis/abusiveexperiencereport';

enum EFileType {
    'image' = 'images',
    'video' = 'videos',
}

type TFileType = "image" | "video"; 

export class FILE {
    static async writeFile(originalName: string, buffer: Buffer, type: TFileType): Promise<string> {
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
    private jwtClient: Auth.JWT;

    private async authorize(): Promise<Auth.JWT> {
        try {
            const jwtClient = new google.auth.JWT(
                googleApiKey.client_email,
                null,
                googleApiKey.private_key,
                SCOPE
            );
    
            await jwtClient.authorize();
            this.jwtClient = jwtClient;
    
            return jwtClient;
        } catch (error) {
            throw new InternalServerError("Google Drive Authorization error!", ErrorTypes.INTERNAL_SERVER_ERROR);
        }
    }

    async uploadFile(FILE: Express.Multer.File, type: TFileType): Promise<IGoogleDriveUploadResponse> {
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

            const { data } = await drive.files.create({
                media: {
                    body: bufferStream,
                    mimeType: mimetype,
                },
                requestBody: fileMetaData as drive_v3.Schema$File,
                fields: 'id',
            }, {
                onUploadProgress: function (data) {
                    // progress control
                },
            });

            return data as IGoogleDriveUploadResponse;
        } catch (error) {
            console.error('Upload error:', error.message);
            throw new InternalServerError("Google Drive Upload error!", ErrorTypes.INTERNAL_SERVER_ERROR);
        }
    }
}
