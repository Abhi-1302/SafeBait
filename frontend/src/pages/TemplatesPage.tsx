import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
} from "@mui/material";
import api from "../api/api.tsx";

interface Template {
  id: number;
  name: string;
  category: string;
  subject: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    api
      .get("/templates")
      .then((res) => setTemplates(res.data || []))
      .catch(() => setTemplates([]));
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" mb={3} fontWeight={700}>
        Email Templates
      </Typography>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <List>
          {templates.length === 0 ? (
            <Typography color="text.secondary" align="center">
              No Templates Available
            </Typography>
          ) : (
            templates.map((template) => (
              <ListItem key={template.id} divider>
                <ListItemText
                  primary={template.name}
                  secondary={template.subject}
                />
                <Box ml={2}>
                  <Chip label={template.category} color="primary" />
                </Box>
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
}
