import { useState, useRef } from "react";

function EmptyMessage() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      oops empty
    </div>
  );
}

function InputBar({ onSubmit }) {
  const [query, setQuery] = useState("");
  return (
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
              onSubmit(query);
              setQuery("");
            }}
            disabled={query.length === 0}
          >
            Ask your AI
          </button>
        </div>
      </div>
    </div>
  );
}

function Message({ type, message }) {
  if (type === "to") {
    return (
      <div>
        You
        <div
          style={{
            background: "darkgray",
            padding: "8px",
            width: "50%",
          }}
        >
          {message}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div style={{ marginLeft: "auto", width: "50%" }}>Whisper</div>
      <div
        style={{
          background: "darkgray",
          padding: "8px",
          width: "50%",
          marginLeft: "auto",
        }}
      >
        {message}
      </div>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
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
              <Message key={`{message}-{index}`} type="to" message={message} />
            );
          })}
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
          background: "grey",
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
          const newMessages = [...messages, value];
          setMessages(newMessages);
        }}
      />
    </div>
  );
}
