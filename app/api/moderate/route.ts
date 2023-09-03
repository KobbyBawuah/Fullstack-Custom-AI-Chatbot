import { NextRequest, NextResponse } from 'next/server'
import { getModeration } from '../../../utils'

interface ModerationResult {
    results?: {
        categories: string[];
        // Add other properties if needed
    };
}

//function named POST which will be executed when a POST request is made to this API route.
export async function POST(req: NextRequest) {
    const question = await req.json()

    if (!question) {
        return NextResponse.json({
            error: 'Question is missing.'
        });
    }

    try {
        const result = await getModeration(question);
        console.log("from route after calling getModeration:", result)
        if (result) {
            // const errorMessage = `The question "${question}" was flagged for the following reasons:\n${result.results.categories}`;
            const errorMessage = `The question "${question}" was flagged for the following reasons:\n${result}`;
            return NextResponse.json({ success: true, error: result });
        }
        console.log('Moderation came back empty from within route');
        return NextResponse.json({ success: true, error: null });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Something went wrong in the moderation route' });
    }
}