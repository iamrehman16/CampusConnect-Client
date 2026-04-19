// features/admin/components/UsersTab.tsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const PLANNED = [
  'View all users with role badges',
  'Promote contributor → admin',
  'Revoke contributor access',
  'Suspend / reactivate accounts',
  'Search and filter by role',
];

export default function UsersTab() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 480,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ManageAccountsIcon sx={{ fontSize: 28, color: 'primary.main' }} />
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            User management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Full user control panel coming in a future sprint.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {PLANNED.map((item) => (
            <Chip key={item} label={item} size="small" variant="outlined" />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}