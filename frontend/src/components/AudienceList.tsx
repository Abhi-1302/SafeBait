import React from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Box
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";

export interface Audience {
  id: number;
  name: string;
  description: string;
  recipients: { id: number; email: string; name: string }[];
}

interface AudienceListProps {
  audiences: Audience[];
  onDelete?: (id: number) => void;
}

export default function AudienceList({ audiences, onDelete }: AudienceListProps) {
  return (
    <Paper elevation={2} sx={{ borderRadius: 2 }}>
      <List>
        {audiences.map((a) => (
          <ListItem
            divider
            key={a.id}
            secondaryAction={
              onDelete && (
                <IconButton onClick={() => onDelete(a.id)} edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              )
            }
          >
            <GroupIcon color="primary" sx={{ mr: 2 }} />
            <ListItemText
              primary={
                <Typography fontWeight={600}>{a.name}</Typography>
              }
              secondary={
                <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
                  <span>{a.recipients.length} recipients</span>
                  <span style={{ color: "#888" }}>{a.description}</span>
                </Box>
              }
            />
          </ListItem>
        ))}
        {audiences.length === 0 && (
          <ListItem>
            <ListItemText
              primary="No audiences yet. Create your first one!"
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
}
