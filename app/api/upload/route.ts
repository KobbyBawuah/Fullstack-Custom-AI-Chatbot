import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises';

export async function POST(request: NextRequest) {
    const data = await request.formData()

    const files = data.getAll('file');

    if (!files || files.length === 0) {
        return NextResponse.json({ success: false });
    }

    const fileWrites = files.map(async (file, index) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const path = `documents/${file.name}`;

        await fs.writeFile(path, buffer);
        console.log(`Saved file ${index + 1}: ${file.name} to ${path}`);
    });

    await Promise.all(fileWrites);

    return NextResponse.json({ success: true })
}
