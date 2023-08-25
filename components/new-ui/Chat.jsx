import { useState, useRef } from "react";
import Ellipsis from "react-animated-ellipsis";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ModerationToggle from '../ModerationToggle'

function EmptyMessage() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        flexDirection: "column",
      }}
    >
      <ChatBubbleIcon
        style={{ width: "200px", height: "200px", opacity: "0.6" }}
      />
      Start typing in the box below to start a conversation with your AI
    </div>
  );
}

function InputBar({ onSubmit, isLocalLLM, onLoading }) {
  const [query, setQuery] = useState("");
  const [previousQuestionsAndAnswers, setPreviousQuestionsAndAnswers] = useState("");
  const [moderation, setmoderation] = useState(false);


  async function sendQuery() {
    //pass in state of local button to change the function used
    if (!query) return;
    //implement moderation when you have time
    // setResult("");
    onLoading(true);
    console.log("blah", query);

    if (moderation) {
      try {
        const result = await fetch("http://localhost:5000/moderate-question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON because I was getting an error
          },
          //Just pass querry if you wish to reduce burden on local model to not keep context of conversation
          body: JSON.stringify(query),
        });
        const json = await result.json();
        if (result.status !== 200) {
          console.log("Moderation failed:");
          const errorMessage = json.errors.join(", "); // Join errors if there are multiple
          onLoading(false);
          alert(
            "Question moderation failed: " +
            errorMessage +
            "You will need to reload the page to continue"
          );
          window.location.reload();
        }
      } catch (err) {
        console.log(
          "err: An error occurred while moderating the question:",
          err
        );
      }
    }

    if (!isLocalLLM) {
      const message =
        previousQuestionsAndAnswers + "Human: " + query + " " + "\n" + "AI: ";
      // console.log(message);
      try {
        const result = await fetch("/api/read", {
          method: "POST",
          body: JSON.stringify(message),
        });
        const json = await result.json();
        onSubmit({ user: false, value: json.data });
        //append question and answer for context
        setPreviousQuestionsAndAnswers(
          (prev) => prev + "Human: " + query + " " + "AI: " + json.data + " "
        );
      } catch (err) {
        console.log("err:", err);
      }
    } else {
      const message =
        previousQuestionsAndAnswers + "Human: " + query + " " + "\n" + "AI: ";
      console.log(message);
      try {
        const result = await fetch("http://localhost:5000/ask-bot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON because I was getting an error
          },
          //Just pass querry if you wish to reduce burden on local model to not keep context of conversation
          body: JSON.stringify(query),
        });
        console.log(query);
        const json = await result.json();
        console.log(json);
        onSubmit({ user: false, value: json.data });
        //append question and answer for context
        setPreviousQuestionsAndAnswers(
          (prev) => prev + "Human: " + query + " " + "AI: " + json.data + " "
        );
      } catch (err) {
        console.log("err:", err);
      }
    }
    onLoading(false);
  }

  return (
    <div >
      <div className="px-4 py- rounded-t-lg text-center">
        <h1 className="text-xl font-semibold mb-4">Moderation Setting</h1>
        <div>
          <ModerationToggle moderation={moderation} setmoderation={setmoderation} />
        </div>
      </div>

      <div className="w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
          <label htmlFor="comment" className="sr-only">
            Your question
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask you question here..."
            required
            value={query}
          ></textarea>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
          <div className="w-full flex flex-col items-center justify-center">
            <button
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
              onClick={() => {
                onSubmit({ user: true, value: query });
                setQuery("");
                sendQuery();
              }}
              disabled={query.length === 0}
            >
              Ask your AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Message({ type, message }) {
  if (type === "to") {
    return (
      <div
        style={{
          marginTop: "8px",
          marginLeft: "auto",
        }}
      >
        <div style={{ width: "50%", marginLeft: "auto" }}>You</div>
        <div
          style={{
            background: "darkgray",
            padding: "8px",
            width: "50%",
            borderRadius: "8px",
            marginLeft: "auto",
          }}
        >
          {message}
        </div>
      </div>
    );
  }
  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ width: "50%" }}>Whisper</div>
      <div
        style={{
          background: "darkgray",
          padding: "8px",
          width: "50%",
          borderRadius: "8px",
        }}
      >
        {message}
      </div>
    </div>
  );
}

export default function Chat({ isLocalLLM }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const isEmpty = messages.length === 0;

  let content;
  switch (isEmpty) {
    case true:
      content = <EmptyMessage />;
      break;
    case false:
      content = (
        <div>
          {messages.map((message, index) => {
            return (
              <Message
                key={`${message}-${index}`}
                type={message.user ? "to" : "from"}
                message={message.value}
              />
            );
          })}
          {isLoading && (
            <div style={{ width: "50%", marginTop: "24px" }}>
              <span>
                Loading
                <Ellipsis fontSize="1.5rem" />
              </span>
            </div>
          )}
        </div>
      );
      break;
  }

  return (
    <div
      style={{
        height: "calc(100vh - 32px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          padding: "20px",
          background: "lightgray",
          overflowY: "auto",
          display: "flex",
          gap: "8px",
          flexDirection: "column",
        }}
      >
        {content}
      </div>
      <InputBar
        onSubmit={(value) => {
          setMessages((prevMessages) => [...prevMessages, value]);
        }}
        onLoading={setLoading}
        isLocalLLM={isLocalLLM}
      />
    </div>
  );
}
