import { Readable } from "stream";

export interface IPagination {
    page: number;
    limit: number;
}

export interface IGoogleDriveUploadResponse {
    id: string;
}

export interface GlobalExpressMulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    stream: Readable;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}