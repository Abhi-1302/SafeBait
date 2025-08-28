import React, { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";

interface NotificationContextProps {
  notify: (message: string, severity?: "success" | "error" | "info" | "warning") => void;
}

const NotificationContext = createContext<NotificationContextProps>({} as NotificationContextProps);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error" | "info" | "warning">("info");

  const notify = (msg: string, sev: "success" | "error" | "info" | "warning" = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
