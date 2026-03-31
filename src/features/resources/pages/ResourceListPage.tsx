import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ResourceListPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Resource Library
      </Typography>
      <Typography color="text.secondary">
        Browse and search academic resources. Feature coming soon.
      </Typography>
    </Box>
  );
}
