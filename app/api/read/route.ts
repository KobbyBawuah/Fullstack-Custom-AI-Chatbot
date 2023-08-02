import { NextRequest, NextResponse } from 'next/server'
import { PineconeClient } from '@pinecone-database/pinecone'
import { queryVectorStoreAndLLM, } from '../../../utils'
import { indexName } from '../../../config'

//function named POST which will be executed when a POST request is made to this API route.
export async function POST(req: NextRequest) {
    try {
        //getting the query that is coming in
        const body = await req.json()
        //This creates a new instance of the pinecone client which will be used to interact with the Pinecone vector database.
        const client = new PineconeClient()
        //initializes the PineconeClient   
        await client.init({
            apiKey: process.env.PINECONE_API_KEY || '',
            environment: process.env.PINECONE_ENVIRONMENT || ''
        })
        //It performs the task of querying the Pinecone vector store and using the language model to find an answer to the question in the body.
        const text = await queryVectorStoreAndLLM(client, indexName, body)

        if (text === null) {
            throw new Error('Null response from the language model.');
        }
        // This constructs the API response
        return NextResponse.json({
            data: text
        })
    } catch (error) {
        console.error('Error occurred:', error);
        return NextResponse.json({
            error: 'An error occurred while processing the request from within the read from pinecone route.'
        });
    }
}