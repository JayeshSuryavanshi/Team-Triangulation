import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3d5afe' },
    secondary: { main: '#f50057' },
    background: { default: '#f5f6fa' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
});

export default theme;
