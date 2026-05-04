import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PageContainer } from '@/shared/components/PageContainer';

export default function DashboardPage() {
  return (
    <PageContainer>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
      </Typography>
      <Typography color="text.secondary">
        Welcome to your academic hub. Feature coming soon.
      </Typography>
    </Box>
    </PageContainer>
  );
}
