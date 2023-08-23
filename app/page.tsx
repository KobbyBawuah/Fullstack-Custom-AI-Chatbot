'use client'
import React from 'react';
import { Fragment, useState, useEffect, useRef } from 'react'
import Dropzone from '../components/Dropzone';
import Banner from '../components/Banner'
import Modal from '../components/Modal'
import { Button } from '@/components/Button';
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [trained, setTrained] = useState(false)
  const [previous_questions_and_answers, setPreviousQuestionsAndAnswers] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonDisabled1, setButtonDisabled1] = useState(false);
  const [buttonDisabled2, setButtonDisabled2] = useState(false);
  const [open, setOpen] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  //create state for if local button is clicked

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

  //sends a request to the backend local server to create the index and generate embeddings for the documents locally. 
  async function createIndexAndEmbeddingslocally() {
    setButtonDisabled2(true)

    //create a version of this app
    // handleBotCreationNote()

    try {
      const result = await fetch('http://localhost:5000/run_ingest', {
        method: "POST"
      });
      const json = await result.json();
      setTrained(true);
      console.log('result from local: ', json);
    } catch (err) {
      console.log('err:', err);
    }
    setButtonDisabled2(false);
  }

  async function showChatbot() {
    setTrained(true)
    setButtonDisabled(true);
  }

  async function deleteKnowledgebase() {
    //local DB deletion
    try {
      const result = await fetch('http://localhost:5000/delete-vectorstore', {
        method: "POST"
      });
      const json = await result.json();
      setTrained(true);
      console.log('result from local: ', json);
    } catch (err) {
      console.log('err:', err);
    }

    //pinecone deletion
    try {
      const result = await fetch('/api/dbdelete', {
        method: "POST"
      })
      const json = await result.json()
      console.log('result: ', json)
    } catch (err) {
      console.log('err:', err)
    }
  }

  function handleBotCreationNote() {
    setModalOpen(true);
  }

  //sends a POST request to the backend route:/api/read endpoint with the user's question as the request body
  async function sendQuery() {


    //pass in state of local button to change the function used 



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
      {/* Another possible component */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          <strong>Streamlined Workflow for Training Your Chat Bot: </strong>
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <ol className="list-decimal pl-6 space-y-2">
                          <p className="text-gray-800">
                            <li>
                              <strong>Utilize Existing Knowledge Base: </strong>
                              If you've previously trained your chat bot and want to leverage that knowledge, simply choose the option labeled "Ask your already created Knowledge base" located at the lower right corner of the user interface.
                            </li>
                          </p>
                          <p className="text-gray-800">
                            <li>
                              <strong>Training with New Data: </strong>
                              Should you opt to train your chat bot with fresh data, begin by uploading your relevant documents. This can be achieved by selecting the appropriate files. For your convenience, a preview section is available to review the uploaded documents.
                            </li>
                          </p>
                          <p className="text-gray-800">
                            <li>
                              <strong>Refining Your Selections: </strong>
                              To ensure your content is accurate, you could cancel uploaded data. Also the option to "remove all previewed files" is at your disposal. This step allows you to make informed decisions about the materials you intend to include.
                            </li>
                          </p>
                          <p className="text-gray-800">
                            <li>
                              <strong>Initiating File Processing: </strong>
                              Once you are satisfied with your chosen documents, proceed by clicking the "send files for processing" button. This action prompts the chat bot to securely store the uploaded files within the backend system.
                            </li>
                          </p>
                          <p className="text-gray-800">
                            <li>
                              <strong>Continuous Document Addition: </strong>
                              Should you wish to augment your training data further, you can repeat the process. Begin by clearing the existing previewed files, then select and send additional files for processing
                            </li>
                          </p>
                          <p className="text-gray-800">
                            <li>
                              <strong>Effortless Data Removal: </strong>
                              For comprehensive control, the option to "Delete all sent files" is accessible. This feature empowers you to clear all currently saved data with ease.
                            </li>
                          </p>
                          <p className="text-gray-800">
                            <li>
                              <strong>Creating Your Custom Knowledge Base: </strong>
                              The time arrives to craft your personalized chat bot. By selecting "Create your knowledge base" located at the bottom left corner, the system initiates the learning process. Once completed, your chat bot emerges and is ready for interaction.
                            </li>
                          </p>
                        </ol>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>


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
            <Button className=" mt-4 mb-4" onClick={createIndexAndEmbeddings} disabled={buttonDisabled1}>Create Knowledge base using OpenAI</Button>
            <Button className=" mt-4 mb-4" onClick={showChatbot} disabled={buttonDisabled}>Ask your already created Knowledge base</Button>
            <Button className=" mt-4 mb-4" onClick={createIndexAndEmbeddingslocally} disabled={buttonDisabled2}>Create private knowledge base</Button>
            <Button className=" mt-4 mb-4" onClick={deleteKnowledgebase}>Delete Knowledge bases</Button>
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
