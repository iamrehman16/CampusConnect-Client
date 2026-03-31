import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function AiChatPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Assistant
      </Typography>
      <Typography color="text.secondary">
        Chat with AI about your academic materials. Feature coming soon.
      </Typography>
    </Box>
  );
}
