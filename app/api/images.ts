import path from 'path';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

// Function to get the image file based on file type
function getImageFile(type) {
    const imageDir = path.join(process.cwd(), 'public/images');
    switch (type) {
        case 'application/pdf':
            return path.join(imageDir, 'pdf_image.png');
        case 'text/plain':
            return path.join(imageDir, 'text_image.png');
        case 'text/markdown':
            return path.join(imageDir, 'markdown_image.png');
        default:
            // Return a default image if the file type is not recognized
            return path.join(imageDir, 'default_image.png');
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { type } = req.query;
    const imageFile = getImageFile(type);

    fs.readFile(imageFile, (err, data) => {
        if (err) {
            return res.status(404).end();
        }
        res.setHeader('Content-Type', 'image/png');
        res.end(data);
    });
}