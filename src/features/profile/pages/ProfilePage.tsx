import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ProfilePage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Typography color="text.secondary">
        Your profile and settings. Feature coming soon.
      </Typography>
    </Box>
  );
}
