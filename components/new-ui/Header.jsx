import { colors } from "@/styles/colors";

export default function Header({ onAsk, onSetup }) {
  return (
    <div
      className="flex flex-row justify-between px-4 items-center"
      style={{ height: "32px", background: colors.purple200 }}
    >
      <button onClick={onAsk}>Ask</button>
      <div>Some Label</div>
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={onSetup}>Create/Edit</button>
        <button>🗑️</button>
      </div>
    </div>
  );
}
