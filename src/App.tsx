import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              CampusConnect
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Coming Soon
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Backend API: {import.meta.env.VITE_API_BASE_URL}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              WebSocket URL: {import.meta.env.VITE_SOCKET_URL}
            </Typography>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;