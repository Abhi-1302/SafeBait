import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4c34d3ff' },        
    secondary: { main: '#e53935' },
    background: {
      default: '#fafafa',
      paper: '#ffffffa4',
    },
    text: {
      primary: '#212121ff',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7b1fa2' },        
    secondary: { main: '#f50057' },
    background: {
      default: '#212121',
      paper: '#121212',
    },
    text: {
      primary: '#f3e5f5',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
  },
});
