import { colors } from "@/styles/colors";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import HomeIcon from '@mui/icons-material/Home';

export default function Header({ onHome, isLocal }) {
  return (
    <div>
      <Box onClick={onHome} sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab variant="extended" size="medium" color="primary" aria-label="add" sx={{ color: 'black' }}>
          <HomeIcon fontSize="large" />
          Home
        </Fab>
      </Box>
      {isLocal !== null && (
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{isLocal ? "Local Chatbot" : "OpenAI Chatbot"}</div>
      )}
      <div />
    </div>
  );
}
