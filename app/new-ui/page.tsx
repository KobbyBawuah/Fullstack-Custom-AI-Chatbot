"use client";
import { useEffect, useState } from "react";
import Header from "../../components/new-ui/header";
import Chat from "@/components/new-ui/Chat";
import ChatSelector from "@/components/new-ui/ChatSelector";
import Setup from "@/components/new-ui/Setup";

export default function NewUI() {
  const [screen, setScreen] = useState("home");
  const [local, setLocal] = useState(null);

  useEffect(() => {
    // TODO: Check for any chat setups
  }, []);

  let content;
  switch (screen) {
    case "home":
      content = (
        <ChatSelector
          onSelect={(isLocal) => {
            setLocal(isLocal);

            const exists = false;
            if (exists) {
              setScreen("chat");
            } else {
              setScreen("setup");
            }
          }}
        />
      );
      break;
    case "chat":
      content = <Chat />;
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
    default:
      content = <Chat />;
      break;
  }

  return (
    <div className="flex flex-col justify-between" style={{ height: "100vh" }}>
      <Header
        onHome={() => {
          setScreen("home");
          setLocal(null);
        }}
        isLocal={local}
      />
      {content}
    </div>
  );
}
