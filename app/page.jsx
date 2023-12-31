"use client";
import { useEffect, useState } from "react";
import Header from "../components/new-ui/header";
import Chat from "@/components/new-ui/Chat";
import ChatSelector from "@/components/new-ui/ChatSelector";
import Setup from "@/components/new-ui/Setup";
import WorkflowSlider from "../components/Slider";
import Banner from "../components/Banner"

export default function NewUI() {
  const [screen, setScreen] = useState("home");
  const [local, setLocal] = useState(null);
  const [localDBState, setlocalDBState] = useState(false);
  const [OpenAiDBState, setOpenAiDBState] = useState(false);
  const [open, setOpen] = useState(true);

  async function checklocalDatabaseStates() {
    //local DB check
    try {
      const result = await fetch("http://localhost:5000/localdbcheck", {
        method: "POST",
      });
      const json = await result.json();
      if (result.status === 200) {
        console.log("Result from LocalDB check: ", json);
        setlocalDBState(true);
      } else {
        console.log("Result from LocalDBDB check: ", json);
        setlocalDBState(false);
      }
      //change state of localDBState if exists
    } catch (err) {
      console.log("err:", err);
    }
  }

  async function checkPineconeDatabaseState() {
    //pinecone check
    try {
      const result = await fetch("/api/dbcheck", {
        method: "POST",
      });
      const json = await result.json();
      if (json?.success) {
        console.log("Result from DB check: ", json);
        setOpenAiDBState(true);
      } else {
        console.log("Result from DB check: ", json);
        setOpenAiDBState(false);
      }
    } catch (err) {
      console.log("err in pinecone DB check:", err);
    }
  }

  useEffect(() => {
    const fetchDBStates = async () => {
      await checkPineconeDatabaseState();
      await checklocalDatabaseStates();
    };

    if (screen === "home") {
      fetchDBStates();
    }
  }, [screen]);

  let content;
  switch (screen) {
    case "home":
      content = (
        <ChatSelector
          localExists={localDBState}
          remoteExists={OpenAiDBState}
          localloading={localDBState}
          openloading={OpenAiDBState}
          onSelect={(isLocal, exists) => {
            setLocal(isLocal);
            if (exists) {
              setScreen("chat");
            } else {
              setScreen("setup");
            }
          }}
          onDelete={(type) => {
            if (type === "Local ChatBot") {
              setlocalDBState(false);
            } else {
              setOpenAiDBState(false);
            }
          }}
          onUpload={(isLocal) => {
            setLocal(isLocal);
            setScreen("setup");
          }}
        />
      );
      break;
    case "chat":
      content = <Chat isLocalLLM={local} />;
      break;
    case "setup":
      content = (
        <Setup
          isLocal={local}
          onSetupComplete={() => {
            setScreen("chat");
          }}
        />
      );
      break;
  }

  return (
    <div>
      {/* Another possible component */}
      <WorkflowSlider open={open} setOpen={setOpen} />
      <Banner screen={screen} open={open} setOpen={setOpen} setScreen={setScreen} setLocal={setLocal} local={local} />
      {screen === "home" && (
        <h1 style={{ fontSize: "8em", textAlign: "center", marginTop: "1rem", fontFamily: "Impact, sans-serif" }}>Vault Whisperer</h1>
      )}
      <div className="flex flex-col justify-between" style={{ height: "60vh" }}>
        {content}
      </div>
    </div>
  );
}
