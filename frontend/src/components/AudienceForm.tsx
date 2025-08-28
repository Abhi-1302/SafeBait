import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import api from "../api/api.tsx";
import { useNotification } from "../context/NotificationContext.tsx";

interface AudienceFormProps {
  onCreated: () => void;
}

export default function AudienceForm({ onCreated }: AudienceFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      notify("Audience name is required","error");
      return;
    }
    setLoading(true);
    try {
      await api.post("/audiences", { name, description });
      setName("");
      setDescription("");
      onCreated();
    } catch (error) {
      notify("Failed to create audience","error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" mb={2}>
        Create New Audience
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Audience Name"
          fullWidth
          margin="normal"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          minRows={2}
          maxRows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        <Box mt={2}>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Audience"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
