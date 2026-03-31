import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ChatPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>
      <Typography color="text.secondary">
        Real-time chat with your peers. Feature coming soon.
      </Typography>
    </Box>
  );
}
