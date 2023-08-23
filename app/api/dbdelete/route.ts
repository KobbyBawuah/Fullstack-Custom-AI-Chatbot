import { NextResponse } from 'next/server'
import { PineconeClient } from '@pinecone-database/pinecone'
import { deletePineconeIndex } from '../../../utils'
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
        //delete a Pinecone index
        await deletePineconeIndex(client, indexName)
    } catch (err) {
        //In case of errors during the index deletion
        console.log('error: ', err)
    }

    return NextResponse.json({
        data: 'successfully deleted index in pinecone!'
    })
}


