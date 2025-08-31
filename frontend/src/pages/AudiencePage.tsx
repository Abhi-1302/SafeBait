import React, { useEffect, useState } from "react";
import {
  Container, Typography, Paper, Box, TextField, Grid,
  List, ListItem, ListItemText, IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import api from "../api/api.tsx";
import Button from "../components/common/CustomButton.tsx";
import ConfirmDialog from "../components/common/ConfirmDialog.tsx";
import { useNotification } from "../context/NotificationContext.tsx";
import LoadingSpinner from "../components/common/LoadingSpinner.tsx";
interface Audience {
  id: number;
  name: string;
  description: string;
  recipients: { id: number; email: string; name: string }[];
}

export default function AudiencePage() {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [audienceToDelete, setAudienceToDelete] = useState<number | null>(null);

  const navigate = useNavigate();
  const { notify } = useNotification();

  useEffect(() => {
    fetchAudiences();
  }, []);

  const fetchAudiences = () => {
    api.get("/audiences")
      .then(res => setAudiences(res.data || []))
      .catch(() => notify("Failed to fetch audiences", "error"));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/audiences", { name, description: desc });
      setAudiences((list) => [...list, res.data]);
      setName("");
      setDesc("");
      notify("Audience created successfully!", "success");
    } catch {
      notify("Failed to create audience", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await api.delete(`/audiences/${id}`);
      setAudiences(list => list.filter(a => a.id !== id));
      notify("Audience deleted successfully!", "success");
    } catch {
      notify("Failed to delete audience", "error");
    } finally {
      setLoading(false);
    }
    
  };

  const onDeleteConfirm = () => {
    if (audienceToDelete !== null) {
      handleDelete(audienceToDelete);
    }
    setConfirmOpen(false);
    setAudienceToDelete(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        {loading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
              <LoadingSpinner />
            </Box>
        )}
        <Typography variant="h5" fontWeight={700} mb={2}>
          Manage Audiences
        </Typography>
        <form onSubmit={handleAdd}>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <TextField
                label="Audience Name"
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                label="Description"
                value={desc}
                onChange={e => setDesc(e.target.value)}
                fullWidth
                disabled={loading}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                fullWidth
                disabled={loading || !name}
                sx={{ height: "100%" }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle1" mb={1} fontWeight={600}>
          Your Audiences
        </Typography>
        {audiences.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            Nothing to show here.
          </Typography>
        ) : (
          <List>
            {audiences.map(aud => (
              <ListItem
                key={aud.id}
                divider
                button
                onClick={() => navigate(`/audiences/${aud.id}`)}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={e => {
                      e.stopPropagation();
                      setAudienceToDelete(aud.id);
                      setConfirmOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={aud.name}
                  secondary={`Description: ${aud.description || "None"}`}
                />
                <Typography variant="body2" color="text.secondary">
                  {(aud.recipients || []).length} recipients
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Audience"
        content="Are you sure you want to delete this audience?"
        onCancel={() => {
          setConfirmOpen(false);
          setAudienceToDelete(null);
        }}
        onConfirm={onDeleteConfirm}
        cancelText="Cancel"
        confirmText="Delete"
      />
    </Container>
  );
}