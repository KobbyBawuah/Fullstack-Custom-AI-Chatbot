'use client'
import React from 'react';
import { Fragment, useState, useEffect, useRef } from 'react'
import Dropzone from '../components/Dropzone';
import Banner from '../components/Banner'
import Modal from '../components/Modal'
import { Button } from '@/components/Button';
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import DemoWorkflowDrawer from '@/components/DemoWorkflowDrawer';

export default function Home() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [trained, setTrained] = useState(false)
  const [previous_questions_and_answers, setPreviousQuestionsAndAnswers] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonDisabled1, setButtonDisabled1] = useState(false);
  const [open, setOpen] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const bottomContainerRef = useRef(null);

  //sends a POST request to the backend route:/api/setup endpoint to create the index and generate embeddings for the documents. 
  async function createIndexAndEmbeddings() {
    setButtonDisabled1(true)
    handleBotCreationNote()
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
    setButtonDisabled1(false);
  }

  async function showChatbot() {
    setTrained(true)
    setButtonDisabled(true);
  }

  function handleBotCreationNote() {
    setModalOpen(true);
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

  useEffect(() => {
    if (trained && bottomContainerRef.current) {
      bottomContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [trained]);

  return (
    <div>
      <DemoWorkflowDrawer open={open} setOpen={setOpen}/>
      <Banner open={open} setOpen={setOpen} />
      <section className='flex flex-col gap-2 py-10'>
        {/* Style the components */}
        <div className='container'>
          <h1 className='text-5xl font-semibold tracking-wide'>Ask your PDFs, Markdown documents or Text files 💬</h1>
          <hr></hr>
          <hr></hr>
          <hr></hr>
          <hr></hr>
          {/* <button className="px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2" onClick={throwerror}>Click to throw frontend error</button>
        <button className="px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2" onClick={throwapierror}>Click to throw API Route Error</button> */}
        </div>

        <div className='container'>
          {/* Upload section */}
          <h1 className='text-3xl font-semibold tracking-wide'>Upload Files</h1>
          <Dropzone className='p-16 mt-10 border border-neutral-200' />
          <div className='flex justify-between mt-4'>
            { /* consider removing this button from the UI once the embeddings are created ... */}
            <Button className=" mt-4 mb-4" onClick={createIndexAndEmbeddings} disabled={buttonDisabled1}>Create Knowledge base</Button>
            <Button className=" mt-4 mb-4" onClick={showChatbot} disabled={buttonDisabled}>Ask your already created Knowledge base</Button>
          </div>
          {/* <h2 className='text-zinc-600'>Note: The chat bot may take sometime to train. The chat bot will appear below once the training is completed.</h2> */}
        </div>

        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} />

        <div className='container' style={{ display: trained ? "block" : "none" }}>
          {/* <div className='container'> */}

          {/* Could make the below section another component not a priotity currently*/}
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
              <label htmlFor="comment" className="sr-only">Your question</label>
              <textarea
                id="comment"
                rows="4"
                className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                onChange={e => setQuery(e.target.value)}
                placeholder="Ask you question here..."
                required
              ></textarea>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
              <div className="w-full flex flex-col items-center justify-center">
                <button
                  onClick={sendQuery}
                  className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                >
                  Ask your AI
                </button>
              </div>
            </div>
          </div>
          {/* Could make this another component not a priotity currently* ^^^^^^/}

          {/* If the loading state is true, it displays the loading message, and if the result state is not empty, it displays the result obtained from the server. */}
          {
            loading && (
              <div className="mt-4 border border-gray-200 rounded p-4 bg-gray-100">
                <p className="text-lg text-gray-800">Asking AI ...</p>
              </div>
            )
          }
          {result && (
            <div className="mt-4 border border-gray-200 rounded p-4 bg-gray-100">
              <p className="text-lg text-gray-800">{result}</p>
            </div>
          )}
          <div ref={bottomContainerRef} />
        </div>
      </section>
    </div>
  )
}
