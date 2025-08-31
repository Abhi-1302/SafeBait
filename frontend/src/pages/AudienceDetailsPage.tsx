import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Button from "../components/common/CustomButton.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import api from "../api/api.tsx";
import ExcelUpload from "../components/ExcelUpload.tsx";
import ConfirmDialog from "../components/common/ConfirmDialog.tsx";
import { useNotification } from "../context/NotificationContext.tsx";

interface Recipient {
  id: number;
  email: string;
  name: string;
}

export default function AudienceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [audienceName, setAudienceName] = useState("");
  const [audienceDesc, setAudienceDesc] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [recipientToDelete, setRecipientToDelete] = useState<number | null>(null);

  const { notify } = useNotification();

  useEffect(() => {
    if (!id) return;
    api.get(`/audiences/${id}`)
      .then(res => {
        setRecipients(res.data.recipients || []);
        setAudienceName(res.data.name || "");
        setAudienceDesc(res.data.description || "");
      })
      .catch(() => {
        notify("Failed to fetch audience details", "error");
        setRecipients([]);
      });
  }, [id, notify]);

  const handleDelete = async (recipientId: number) => {
    try {
      await api.delete(`/recipients/${recipientId}`);
      setRecipients(list => list.filter(r => r.id !== recipientId));
      notify("Recipient deleted successfully!", "success");
    } catch {
      notify("Failed to delete recipient.", "error");
    }
  };

  const onDeleteConfirm = () => {
    if (recipientToDelete !== null) {
      handleDelete(recipientToDelete);
    }
    setConfirmOpen(false);
    setRecipientToDelete(null);
  };

  const handleAdd = async () => {
    if (!email.trim()) {
      notify("Email is required", "warning");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post(`/recipients`, {
        audienceId: Number(id),
        email,
        name,
      });
      setRecipients(list => [...list, res.data]);
      setEmail("");
      setName("");
      setAddOpen(false);
      notify("Recipient added successfully!", "success");
    } catch {
      notify("Failed to add recipient.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleExcelUpload = (newRecipients: { email: string; name?: string }[]) => {
    setLoading(true);
    Promise.all(newRecipients.map(r =>
      api.post(`/recipients`, { audienceId: Number(id), email: r.email, name: r.name || "" })
    ))
      .then(results => {
        setRecipients(prev => [...prev, ...results.map(r => r.data)]);
        notify("Recipients imported successfully!", "success");
      })
      .catch(() => {
        notify("Failed to upload some recipients.", "error");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" mb={1} fontWeight={700}>
        Audience: {audienceName}
      </Typography>
      <Typography variant="subtitle1" mb={3} color="text.secondary">
        {audienceDesc}
      </Typography>

      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Button variant="contained" onClick={() => setAddOpen(true)}>
          Add Recipient
        </Button>
        <ExcelUpload onUpload={handleExcelUpload} />
      </Box>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        {recipients.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No recipients found.
          </Typography>
        ) : (
          <List>
            {recipients.map(r => (
              <ListItem key={r.id} divider
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => {
                    setRecipientToDelete(r.id);
                    setConfirmOpen(true);
                  }}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={r.email} secondary={r.name} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Recipient</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={loading}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Recipient"
        content="Are you sure you want to delete this recipient?"
        onCancel={() => {
          setConfirmOpen(false);
          setRecipientToDelete(null);
        }}
        onConfirm={onDeleteConfirm}
        cancelText="Cancel"
        confirmText="Delete"
      />
    </Container>
  );
}