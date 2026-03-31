import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function AdminDashboardPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography color="text.secondary">
        System overview and statistics. Feature coming soon.
      </Typography>
    </Box>
  );
}
