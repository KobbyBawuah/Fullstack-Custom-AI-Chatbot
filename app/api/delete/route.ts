import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const files = await fs.readdir('documents');

        // Iterate through all files in the 'documents' directory and delete them one by one
        const fileDeletions = files.map(async (file) => {
            const filePath = `documents/${file}`;
            await fs.unlink(filePath);
            console.log(`Deleted file: ${filePath}`);
        });

        await Promise.all(fileDeletions);
        console.log('All files in the document directory have been deleted.');

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Error deleting files:', err);
        return NextResponse.json({ success: false, error: 'Error deleting files' });
    }
}
