import React from "react";
import { Container, Typography, Paper } from "@mui/material";

export default function SettingsPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" mb={3} fontWeight={700}>
        Settings
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Settings page is under construction. Coming soon!
        </Typography>
      </Paper>
    </Container>
  );
}
