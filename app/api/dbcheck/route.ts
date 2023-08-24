import { NextResponse } from 'next/server'
import { PineconeClient } from '@pinecone-database/pinecone'
import { checkPineconeIndex } from '../../../utils'
import { indexName } from '../../../config'

//will use this route to delete index in pinecone. Just another API route handler.
export async function POST() {

    //Initialize Pinecone Client
    const client = new PineconeClient()
    await client.init({
        apiKey: process.env.PINECONE_API_KEY || '',
        environment: process.env.PINECONE_ENVIRONMENT || ''
    })

    try {
        //chaeck a Pinecone index
        const alive = await checkPineconeIndex(client, indexName)
        if (alive) {
            return NextResponse.json({ success: true, error: null });
        } else {
            return NextResponse.json({ success: false, error: 'OpenAI Index not created' });
        }
    } catch (err) {
        //In case of errors during the index check
        console.log('error: ', err)
        return NextResponse.json({ success: false, error: 'Failed to check OpenAI Database' });
    }
}


