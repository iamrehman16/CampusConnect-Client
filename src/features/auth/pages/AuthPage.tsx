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
        background:
          'radial-gradient(ellipse at 20% 50%, rgba(108, 99, 255, 0.08) 0%, transparent 50%), ' +
          'radial-gradient(ellipse at 80% 50%, rgba(0, 217, 166, 0.06) 0%, transparent 50%)',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          border: '1px solid rgba(148, 163, 184, 0.1)',
          bgcolor: 'rgba(17, 24, 39, 0.8)',
          backdropFilter: 'blur(20px)',
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
                background:
                  'linear-gradient(135deg, #6C63FF 0%, #00D9A6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
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
            sx={{
              mb: 3,
              '& .MuiTab-root': { borderRadius: 2 },
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
