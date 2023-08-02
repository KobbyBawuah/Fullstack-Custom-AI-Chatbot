import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { indexName, timeout } from "./config";

//creating pinecone index
export const createPineconeIndex = async (
    //pinecone clinet 
    client,
    indexName,
    //dimensions for the vector data base
    vectorDimension
) => {
    // Initiate index existence check
    console.log(`Checking "${indexName}"...`);
    // Get list of existing indexes
    const existingIndexes = await client.listIndexes();
    // If index doesn't exist, create it
    if (!existingIndexes.includes(indexName)) {
        // Index creation initiation
        console.log(`Creating "${indexName}"...`);
        await client.createIndex({
            createRequest: {
                name: indexName,
                dimension: vectorDimension,
                metric: 'cosine',
            },
        });
        // Log successful creation
        console.log(`Creating index.... please wait for it to finish initializing.`);
        // Wait for index initialization
        await new Promise((resolve) => setTimeout(resolve, timeout));
    } else {
        // Log if index already exists
        console.log(`"${indexName}" already exists.`);
    }
}

//upload to indexes 
export const updatePinecone = async (client, indexName, docs) => {
    console.log('Retrieving Pinecone index...');
    // Retrieve Pinecone index
    const index = client.Index(indexName);
    // Log the retrieved index name
    console.log(`Pinecone index retrieved: ${indexName}`);
    // Process each document in the docs array
    for (const doc of docs) {
        console.log(`Processing document: ${doc.metadata.source}`);
        //path on local system
        const txtPath = doc.metadata.source;
        //actual data
        const text = doc.pageContent;
        // Create RecursiveCharacterTextSplitter instance
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
        });
        console.log('Splitting text into chunks...');
        // Split text into chunks (documents)
        const chunks = await textSplitter.createDocuments([text]);
        console.log(`Text split into ${chunks.length} chunks`);
        console.log(
            `Calling OpenAI's Embedding endpoint documents with ${chunks.length} text chunks ...`
        );
        // creating OpenAI embeddings for a list of documents to capture their semantic meaning
        const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
            chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
        );
        console.log('Finished embedding documents');
        console.log(
            `Creating ${chunks.length} vectors array with id, values, and metadata...`
        );
        // Create and upsert vectors in batches of 100
        // sets the maximum size of each batch.
        const batchSize = 100;
        //used to store vectors (embeddings) for a batch of documents.
        let batch: any = [];
        //iterates over each element in the chunks array
        for (let idx = 0; idx < chunks.length; idx++) {
            const chunk = chunks[idx];
            //creates a vector object for each document
            const vector = {
                //unique identifier for the vector
                id: `${txtPath}_${idx}`,
                //The embeddings for the document, obtained from the embeddingsArrays using the current idx
                values: embeddingsArrays[idx],
                //Additional metadata associated with the vector.
                metadata: {
                    ...chunk.metadata,
                    loc: JSON.stringify(chunk.metadata.loc),
                    pageContent: chunk.pageContent,
                    txtPath: txtPath,
                },
            };
            // vector object is added to the batch array.
            batch = [...batch, vector]
            // When batch is full or it's the last item, upsert the vectors
            if (batch.length === batchSize || idx === chunks.length - 1) {
                //The upsert method is used to insert or update the vectors of the batch into the index
                await index.upsert({
                    upsertRequest: {
                        vectors: batch,
                    },
                });
                // Empty the batch after upserting the vectors, so it can be used for the next batch of documents.
                batch = [];
            }
        }
        //Log the number of vectors updated
        console.log(`Pinecone index updated with ${chunks.length} vectors`);
    }
};

//query pinecone 
export const queryVectorStoreAndLLM = async (
    client,
    indexName,
    question
) => {
    // Start query process
    console.log('Querying Pinecone vector store...');
    // Retrieve the Pinecone index
    const index = client.Index(indexName);
    // Create embedding of the question into a vector representation for use in the Pinecone index query.
    const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question)
    // Query Pinecone index and return top 10 matches
    let queryResponse = await index.query({
        queryRequest: {
            topK: 10,
            vector: queryEmbedding,
            includeMetadata: true,
            includeValues: true,
        },
    });
    // Log the number of matches 
    console.log(`Found ${queryResponse.matches.length} matches...`);
    // Question being asked
    console.log(`Question asked: ${question}...`);
    // If there are matches in the query response
    if (queryResponse.matches.length) {
        // Create an OpenAI instance and load the question-answering model (QAStuffChain) using the loadQAStuffChain function.
        const llm = new OpenAI({});
        //simplest follows what I did for the python version of the bot which was to just inject the inputs as prompts
        const chain = loadQAStuffChain(llm);
        // Extract and concatenate page content from matched documents
        const concatenatedPageContent = queryResponse.matches
            .map((match) => match.metadata.pageContent)
            .join(" ");
        // Execute the chain with input documents and question
        const result = await chain.call({
            input_documents: [new Document({ pageContent: concatenatedPageContent })],
            question: question,
        });
        // Log the answer from the language model.
        console.log(`Answer: ${result.text}`);
        return result.text
    } else {
        // Log that there are no matches, so no query will be made
        console.log('Since there are no matches, GPT-3 will not be queried.');
    }
};