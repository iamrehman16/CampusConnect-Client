import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function AdminResourcesPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Resource Moderation
      </Typography>
      <Typography color="text.secondary">
        Approve, reject, and manage resources. Feature coming soon.
      </Typography>
    </Box>
  );
}
