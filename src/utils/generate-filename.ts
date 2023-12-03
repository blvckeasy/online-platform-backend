import { v4 as uuidv4 } from 'uuid';
import path from 'path';


export async function generateFileName (originalName: string) {
    const ext = path.extname(originalName);
    const newFileName = uuidv4() + ext;
    return newFileName
}