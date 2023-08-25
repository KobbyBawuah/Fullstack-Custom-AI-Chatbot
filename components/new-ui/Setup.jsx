import { useState } from "react";
import { Button } from "../Button";
import Dropzone from "../Dropzone";

import LinearProgress from "@mui/material/LinearProgress";

export default function Setup({ isLocal, onSetupComplete }) {
  const [loading, setLoading] = useState(false);

  //sends a POST request to the backend route:/api/setup endpoint to create the index and generate embeddings for the documents.
  async function createIndexAndEmbeddings() {
    setLoading(true);
    try {
      const result = await fetch("/api/setup", {
        method: "POST",
      });
      const json = await result.json();
      // setTrained(true);
      console.log("result: ", json);
    } catch (err) {
      console.log("err:", err);
    }
    setLoading(false);
  }

  //sends a request to the backend local server to create the index and generate embeddings for the documents locally.
  async function createIndexAndEmbeddingslocally() {
    setLoading(true);
    try {
      const result = await fetch("http://localhost:5000/run_ingest", {
        method: "POST",
      });
      const json = await result.json();
      if (result.status !== 200) {
        console.log("result from local: ", json);
        const errorMessage = json.error;
        // alert(
        //   "Issue when trying to run ingest: " +
        //     errorMessage +
        //     '. Go ahead and add more files or click the "Ask already created knowledgebase"'
        // );
      } else {
        //   setTrained(true);
        console.log("trained");
      }
    } catch (err) {
      console.log("err:", err);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "40px",
          flexDirection: "column",
        }}
      >
        <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Training...</h1>
        <div style={{ width: "70%" }}>
          <LinearProgress />
        </div>
      </div>
    );
  }

  const button = isLocal ? (
    <Button
      className=" mt-4 mb-4"
      onClick={async () => {
        await createIndexAndEmbeddingslocally();
        onSetupComplete();
      }}
      disabled={loading}
      loading={loading}
    >
      Create private knowledge base
    </Button>
  ) : (
    <Button
      className=" mt-4 mb-4"
      onClick={async () => {
        await createIndexAndEmbeddings();
        onSetupComplete();
      }}
      disabled={loading}
      loading={loading}
    >
      Create Knowledge base using OpenAI
    </Button>
  );

  return (
    <div>
      <section className="flex flex-col gap-2 py-10">
        <div className="container">
          <h1 className="text-5xl font-semibold tracking-wide">
            Ask your PDFs, Markdown documents or Text files 💬
          </h1>
          <hr></hr>
          <hr></hr>
          <hr></hr>
          <hr></hr>
        </div>
        <div className="container">
          <div style={{ padding: "20px", flex: 1 }}>
            <h1 className="text-3xl font-semibold tracking-wide">Upload Files</h1>
            <Dropzone className="p-16 mt-10 border border-neutral-200" />
            <div style={{ display: "flex", justifyContent: "center" }}>{button}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
