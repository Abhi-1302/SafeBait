import React, { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, useTheme, Box, Typography, IconButton, Fade } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

interface NotificationContextProps {
  notify: (message: string, severity?: "success" | "error" | "info" | "warning") => void;
}

const NotificationContext = createContext<NotificationContextProps>({} as NotificationContextProps);

const getIcon = (severity: "success" | "error" | "info" | "warning") => {
  const icons = {
    success: CheckCircleIcon,
    error: ErrorIcon,
    info: InfoIcon,
    warning: WarningIcon
  };
  const Icon = icons[severity];
  return <Icon />;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error" | "info" | "warning">("info");
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getBackgroundColor = () => {
    const colors = {
      success: isDark ? 'rgba(46, 125, 50, 0.95)' : 'rgba(237, 247, 237, 0.95)',
      error: isDark ? 'rgba(211, 47, 47, 0.95)' : 'rgba(253, 237, 237, 0.95)',
      warning: isDark ? 'rgba(237, 108, 2, 0.95)' : 'rgba(255, 244, 229, 0.95)',
      info: isDark ? 'rgba(2, 136, 209, 0.95)' : 'rgba(229, 246, 253, 0.95)'
    };
    return colors[severity];
  };

  const getTextColor = () => {
    const colors = {
      success: isDark ? '#fff' : '#1b5e20',
      error: isDark ? '#fff' : '#c62828',
      warning: isDark ? '#fff' : '#e65100',
      info: isDark ? '#fff' : '#01579b'
    };
    return colors[severity];
  };

  const notify = (msg: string, sev: "success" | "error" | "info" | "warning" = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Snackbar 
        open={open} 
        autoHideDuration={4000} 
        onClose={handleClose} 
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Fade}
      >
        <Box
          sx={{
            minWidth: 300,
            maxWidth: 500,
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: getBackgroundColor(),
            color: getTextColor(),
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          }}
        >
          {getIcon(severity)}
          <Typography 
            sx={{ 
              flex: 1,
              fontWeight: 500
            }}
          >
            {message}
          </Typography>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              color: 'inherit',
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                bgcolor: 'rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
