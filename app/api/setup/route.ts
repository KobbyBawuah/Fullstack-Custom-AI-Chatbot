import { NextResponse } from 'next/server'
import { PineconeClient } from '@pinecone-database/pinecone'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { createPineconeIndex, updatePinecone } from '../../../utils'
import { indexName } from '../../../config'

//will use this route to interact with pinecone. Just another API route handler.
export async function POST() {
    //load documents from a directory named ./documents based on type
    const loader = new DirectoryLoader('./documents', {
        ".txt": (path) => new TextLoader(path),
        ".md": (path) => new TextLoader(path),
        ".pdf": (path) => new PDFLoader(path)
    })

    const docs = await loader.load()
    //number of dimensions used for the embeddings
    const vectorDimensions = 1536
    //Initialize Pinecone Client
    const client = new PineconeClient()
    await client.init({
        apiKey: process.env.PINECONE_API_KEY || '',
        environment: process.env.PINECONE_ENVIRONMENT || ''
    })

    try {
        //create a Pinecone index
        await createPineconeIndex(client, indexName, vectorDimensions)
        //update the Pinecone index with the loaded documents
        await updatePinecone(client, indexName, docs)
    } catch (err) {
        //In case of errors during the index creation or document updates
        console.log('error: ', err)
    }

    return NextResponse.json({
        data: 'successfully created index and loaded data into pinecone!'
    })
}


