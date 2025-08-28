import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import api from "../api/api.tsx";
import {useNotification} from "../context/NotificationContext.tsx";

interface Audience {
  id: number;
  name: string;
}

interface Template {
  id: number;
  name: string;
  subject: string;
}

interface CampaignFormProps {
  onSubmit: () => void;
}

export default function CampaignForm({ onSubmit }: CampaignFormProps) {
  const [name, setName] = useState("");
  const [audienceId, setAudienceId] = useState<string>("");
  const [templateId, setTemplateId] = useState<string>("");
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  useEffect(() => {
    api.get("/audiences").then((res) => setAudiences(res.data));
    api.get("/templates").then((res) => setTemplates(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !audienceId || !templateId) {
      notify("Please fill all required fields","error");
      return;
    }
    setLoading(true);
    try {
      await api.post("/campaigns", { name, audienceId, templateId });
      onSubmit();
    } catch (error) {
      notify("Failed to create campaign","error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" mb={2}>
        New Campaign
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Campaign Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Select Audience"
          value={audienceId}
          onChange={(e) => setAudienceId(e.target.value)}
          fullWidth
          margin="normal"
          required
        >
          {audiences.map((aud) => (
            <MenuItem key={aud.id} value={aud.id}>
              {aud.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Select Email Template"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          fullWidth
          margin="normal"
          required
        >
          {templates.map((temp) => (
            <MenuItem key={temp.id} value={temp.id}>
              {temp.name} — {temp.subject}
            </MenuItem>
          ))}
        </TextField>
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Create Campaign"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
