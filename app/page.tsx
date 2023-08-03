'use client'
import { useState } from 'react'
import styles from '../styles/buttons.module.css';


export default function Home() {
  //plan ahead:
  //test what happens when you change out the files in the documents directory
  //get users to upload then click creat index and embedding. Delete documents un documents after loading is done
  //when loading is done, show chat bot 
  //come up with a button to either refresh the app or refresh the workflow
  //set up history tracking
  //if time permits, instrument moderation
  //set up promts
  //create new index with an id for each load/ find a way to identify users
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  //sends a POST request to the backend route:/api/setup endpoint to create the index and generate embeddings for the documents. 
  async function createIndexAndEmbeddings() {
    try {
      const result = await fetch('/api/setup', {
        method: "POST"
      })
      const json = await result.json()
      console.log('result: ', json)
    } catch (err) {
      console.log('err:', err)
    }
  }
  //sends a POST request to the backend route:/api/read endpoint with the user's question as the request body
  async function sendQuery() {
    if (!query) return
    setResult('')
    setLoading(true)
    try {
      const result = await fetch('/api/read', {
        method: "POST",
        body: JSON.stringify(query)
      })
      const json = await result.json()
      setResult(json.data)
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
    <main className="flex flex-col items-center justify-between p-24">
      <input className='text-black px-2 py-1' onChange={e => setQuery(e.target.value)} />
      <button className="px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2" onClick={sendQuery}>Ask AI</button>
      <button className="px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2" onClick={throwerror}>Click to throw frontend error</button>
      <button className="px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2" onClick={throwapierror}>Click to throw API Route Error</button>
      {/* If the loading state is true, it displays the loading message, and if the result state is not empty, it displays the result obtained from the server. */}
      {
        loading && <p>Asking AI ...</p>
      }
      {
        result && <p>{result}</p>
      }
      { /* consider removing this button from the UI once the embeddings are created ... */}
      <button onClick={createIndexAndEmbeddings}>Create index and embeddings</button>
    </main>
  )
}
