import Path from 'path';
import Fs from 'fs';
import { generateFileName } from './generate-filename';


enum EFileType {
    'image' = 'images',
    'video' = 'videos',
}

type TFileType = "image" | "video"; 

export class FILE {
    static async writeFile (originalName: string, buffer: Buffer, type: TFileType): Promise<string> {
        const fileName = await generateFileName(originalName);
        console.log("path", Path.join(process.cwd(), "uploads", EFileType[type], fileName));
        const writer = Fs.createWriteStream(Path.join(process.cwd(), "uploads", fileName), {
            flags: "w",
        });

        writer.write(buffer);
        return fileName;
    }
}