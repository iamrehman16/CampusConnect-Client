import { Alert, Collapse } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  return (
    <Collapse in={!isOnline}>
      <Alert
        icon={<WifiOffIcon fontSize="small" />}
        severity="warning"
        sx={{
          borderRadius: 0,
          py: 0.5,
          fontSize: '0.8rem',
        }}
      >
        You're offline — showing cached data
      </Alert>
    </Collapse>
  );
}