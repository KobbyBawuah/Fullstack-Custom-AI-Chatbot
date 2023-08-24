'use client'
import React from 'react';
import { Fragment, useState, useEffect, useRef } from 'react'
import Dropzone from '../components/Dropzone';
import Banner from '../components/Banner';
import Modal from '../components/Modal';
import { Button } from '@/components/Button';
// import { Dialog, Transition } from '@headlessui/react'
// import { XMarkIcon } from '@heroicons/react/24/outline'
import WorkflowSlider from '../components/Slider';
import ChatBot from '../components/ChatBot';

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
  const [localLLM, setLocalLLM] = useState(false)
  const [moderation, setmoderation] = useState(false)
  //create state for if local button is clicked

  const bottomContainerRef = useRef(null);

  //sends a POST request to the backend route:/api/setup endpoint to create the index and generate embeddings for the documents. 
  async function createIndexAndEmbeddings() {
    setLocalLLM(false)
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
    handleBotCreationNote()

    try {
      const result = await fetch('http://localhost:5000/run_ingest', {
        method: "POST"
      });
      const json = await result.json();
      if (result.status !== 200) {
        console.log('result from local: ', json);
        const errorMessage = json.error
        alert('Issue when trying to run ingest: ' + errorMessage + '. Go ahead and add more files or click the "Ask already created knowledgebase"');
      } else {
        setTrained(true);
      }
    } catch (err) {
      console.log('err:', err);
    }
    setButtonDisabled2(false);
    setLocalLLM(true)
  }

  async function showChatbot() {
    setTrained(true)
    setButtonDisabled(true);
  }

  async function deleteOpenAiKnowledgebase() {
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

  async function deletelocalKnowledgebase() {
    //local DB deletion
    try {
      const result = await fetch('http://localhost:5000/delete-vectorstore', {
        method: "POST"
      });
      const json = await result.json();
      console.log('result from local: ', json);
    } catch (err) {
      console.log('err:', err);
    }
  }

  function handleBotCreationNote() {
    setModalOpen(true);
  }

  //sends a POST request to the backend route:/api/read endpoint with the user's question as the request body
  async function sendQuery() {
    //pass in state of local button to change the function used 
    if (!query) return
    //implement moderation when you have time
    setResult('')
    setLoading(true)

    if (moderation) {
      try {
        const result = await fetch('http://localhost:5000/moderate-question', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json' // Set the content type to JSON because I was getting an error
          },
          //Just pass querry if you wish to reduce burden on local model to not keep context of conversation
          body: JSON.stringify(query)
        })
        const json = await result.json()
        if (result.status !== 200) {
          console.log('Moderation failed:');
          const errorMessage = json.errors.join(', '); // Join errors if there are multiple
          alert('Question moderation failed: ' + errorMessage + 'You will need to reload the page to continue');
          return
        }
      } catch (err) {
        console.log('err: An error occurred while moderating the question:', err)
      }
    }

    if (!localLLM) {
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
      } catch (err) {
        console.log('err:', err)
      }
    } else {
      const message = previous_questions_and_answers + "Human: " + query + " " + "\n" + "AI: "
      console.log(message)
      try {
        const result = await fetch('http://localhost:5000/ask-bot', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'  // Set the content type to JSON because I was getting an error
          },
          //Just pass querry if you wish to reduce burden on local model to not keep context of conversation
          body: JSON.stringify(message)
        })
        const json = await result.json()
        setResult(json.data)
        //append question and answer for context
        setPreviousQuestionsAndAnswers(
          prev => prev + "Human: " + query + " " + "AI: " + json.data + " "
        );
      } catch (err) {
        console.log('err:', err)
      }
    }
    setLoading(false)
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
      <WorkflowSlider open={open} setOpen={setOpen} />

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
            <Button className=" mt-4 mb-4" onClick={createIndexAndEmbeddingslocally} disabled={buttonDisabled2}>Create private knowledge base</Button>
            <Button className=" mt-4 mb-4" onClick={showChatbot} disabled={buttonDisabled}>Ask your already created Knowledge base</Button>
            <Button className=" mt-4 mb-4" onClick={deleteOpenAiKnowledgebase}>Delete OpenAI Knowledge base</Button>
            <Button className=" mt-4 mb-4" onClick={deletelocalKnowledgebase}>Delete Local Knowledge base</Button>

          </div>
          {/* <h2 className='text-zinc-600'>Note: The chat bot may take sometime to train. The chat bot will appear below once the training is completed.</h2> */}
        </div>

        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} />

        <div className='container' style={{ display: trained ? "block" : "none" }}>
          {/* <div className='container'> */}

          {/* Could make the below section another component not a priotity currently*/}
          <ChatBot sendQuery={sendQuery} setQuery={setQuery} />
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
