import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

/**
 * Auth route-level page.
 * Tabbed interface for switching between Login and Register forms.
 * Centered vertically and horizontally — full-screen on mobile.
 */
export default function AuthPage() {
  const [activeTab, setActiveTab] = useState(0);

  const handleRegisterSuccess = () => {
    setActiveTab(0); // Switch to Login tab after successful registration
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        bgcolor: 'background.default',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          boxShadow: 'none',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Brand Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              mb: 1,
            }}
          >
            <SmartToyIcon sx={{ fontSize: 36, color: 'primary.main' }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              AcademiQ
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 3 }}
          >
            Your academic resource hub powered by AI
          </Typography>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{
              mb: 3,
            }}
          >
            <Tab label="Sign In" id="auth-tab-0" />
            <Tab label="Sign Up" id="auth-tab-1" />
          </Tabs>

          {/* Forms */}
          {activeTab === 0 && <LoginForm />}
          {activeTab === 1 && <RegisterForm onSuccess={handleRegisterSuccess} />}
        </CardContent>
      </Card>
    </Box>
  );
}
