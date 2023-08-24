import { colors } from "@/styles/colors";

export default function Header({ onHome, isLocal }) {
  return (
    <div
      className="flex flex-row justify-between px-4 items-center"
      style={{ height: "32px", background: colors.purple200 }}
    >
      <button onClick={onHome}>Home</button>
      {isLocal !== null && (
        <div>{isLocal ? "Local Chatbot" : "OpenAI Chatbot"}</div>
      )}
      <div />
    </div>
  );
}
