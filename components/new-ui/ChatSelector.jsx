import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

function SelectorPanel({ label, onClick }) {
  return (
    <div
      style={{
        height: "400px",
        width: "400px",
        background: "lightgray",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "40px",
      }}
      onClick={onClick}
    >
      <AddCircleOutlineIcon style={{ width: "100px", height: "100px" }} />
      {label}
    </div>
  );
}

export default function ChatSelector({ onSelect }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SelectorPanel label="remote" onClick={() => onSelect(false)} />
      <SelectorPanel label="local" onClick={() => onSelect(true)} />
    </div>
  );
}
