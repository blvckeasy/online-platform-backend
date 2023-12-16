import Path from 'path';
import Fs from 'fs';
import { generateFileName } from './generate-filename';


export class FILE {
    static async writeFile (originalName: string, buffer: Buffer): Promise<string> {
        const fileName = await generateFileName(originalName);
        console.log("path", Path.join(process.cwd(), "uploads", fileName));
        const writer = Fs.createWriteStream(Path.join(process.cwd(), "uploads", fileName), {
            flags: "w",
        });

        writer.write(buffer);
        return fileName;
    }
}