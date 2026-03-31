import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function AdminUsersPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Typography color="text.secondary">
        Manage users, roles, and permissions. Feature coming soon.
      </Typography>
    </Box>
  );
}
