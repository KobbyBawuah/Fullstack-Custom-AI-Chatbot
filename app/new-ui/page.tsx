"use client";
import { useEffect, useState } from "react";
import Header from "../../components/new-ui/header";
import Chat from "@/components/new-ui/Chat";

export default function NewUI() {
  const [screen, setScreen] = useState("chat");

  useEffect(() => {
    // TODO: Check for any chat setups
  }, []);

  let content;
  switch (screen) {
    case "chat":
      content = <Chat />;
      break;
    case "setup":
      content = <div>this is setup</div>;
      break;
    default:
      content = <Chat />;
      break;
  }

  return (
    <div className="flex flex-col justify-between">
      <Header
        onAsk={() => setScreen("chat")}
        onSetup={() => setScreen("setup")}
      />
      {content}
    </div>
  );
}
