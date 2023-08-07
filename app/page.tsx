'use client'
import { useState } from 'react'
import Dropzone from '../components/Dropzone';

export default function Home() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [trained, setTrained] = useState(false)
  const [previous_questions_and_answers, setPreviousQuestionsAndAnswers] = useState('');

  //sends a POST request to the backend route:/api/setup endpoint to create the index and generate embeddings for the documents. 
  async function createIndexAndEmbeddings() {
    try {
      const result = await fetch('/api/setup', {
        method: "POST"
      })
      const json = await result.json()
      setTrained(true)
      console.log('result: ', json)
    } catch (err) {
      console.log('err:', err)
    }
  }

  async function showChatbot() {
    setTrained(true)
  }

  //sends a POST request to the backend route:/api/read endpoint with the user's question as the request body
  async function sendQuery() {
    //send built message
    if (!query) return
    //implement moderation when you have time
    setResult('')
    setLoading(true)
    const message = previous_questions_and_answers + "Human: " + query + " " + "\n" + "AI: "
    console.log(message)
    try {
      const result = await fetch('/api/read', {
        method: "POST",
        body: JSON.stringify(message)
      })
      const json = await result.json()
      setResult(json.data)
      //append question and answer for context
      setPreviousQuestionsAndAnswers(
        prev => prev + "Human: " + query + " " + "AI: " + json.data + " "
      );
      setLoading(false)
    } catch (err) {
      console.log('err:', err)
      setLoading(false)
    }
  }

  function throwerror() {
    throw new Error("Sentry Frontend Error");
  }

  function throwapierror() {
    async function callSentryExampleApi() {
      try {
        const response = await fetch("/api/sentry-example-api");
        const data = await response.json();

        if (response.ok) {
          // Handle successful response here
          console.log("Success:", data);
        } else {
          // Handle non-200 status codes (e.g., 500) or other errors here
          console.log("Error:", data.error);
        }
      } catch (error) {
        // Handle any network or other errors here
        console.log("Error:", error);
      }
    }
    // Call the API function
    callSentryExampleApi();

    return (
      // JSX for your component
      <div>
        {/* Your component content */}
      </div>
    );
  }

  return (
    <section className='flex flex-col gap-2 py-24'>
      {/* Style the components */}
      <div className='container'>
        <h1 className='text-5xl font-bold'>Ask your PDF, Markdown documents or Text files 💬</h1>
        <h2 className='text-zinc-600'>After every adjustment of the uploaded documents, recreat the knowledge base</h2>
        {/* <button className="px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2" onClick={throwerror}>Click to throw frontend error</button>
        <button className="px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2" onClick={throwapierror}>Click to throw API Route Error</button> */}
      </div>

      <div className='container'>
        {/* Upload section */}
        <h1 className='text-3xl font-bold'>Upload Files</h1>
        <Dropzone className='p-16 mt-10 border border-neutral-200' />
        <div className='flex justify-between mt-4'>
          { /* consider removing this button from the UI once the embeddings are created ... */}
          <button className="px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2" onClick={createIndexAndEmbeddings}>Create Knowledge base</button>
          <button className="px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2" onClick={showChatbot}>Ask your already created Knowledge base</button>
        </div>
        <h2 className='text-zinc-600'>Note: The chat bot may take sometime to train. The bot will appear below once the training is completed.</h2>
      </div>

      <div className='container' style={{ display: trained ? "block" : "none" }}>
        {/* <div className='container'> */}
        <input className='text-black px-2 py-1' onChange={e => setQuery(e.target.value)} />
        <button className="px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2" onClick={sendQuery}>Ask your AI</button>

        {/* If the loading state is true, it displays the loading message, and if the result state is not empty, it displays the result obtained from the server. */}
        {
          loading && <p>Asking AI ...</p>
        }
        {
          result && <p>{result}</p>
        }
      </div>
    </section>

  )
}
