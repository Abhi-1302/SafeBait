import React from "react";
import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";

export interface Recipient {
  id: number;
  email: string;
  name: string;
}

interface RecipientListProps {
  recipients: Recipient[];
}

export default function RecipientList({ recipients }: RecipientListProps) {
  return (
    <Paper sx={{ borderRadius: 2, p: 2 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Recipients
      </Typography>
      <List>
        {recipients.length === 0 ? (
          <Typography color="text.secondary">No recipients added yet.</Typography>
        ) : (
          recipients.map((r) => (
            <ListItem key={r.id} divider>
              <ListItemText primary={r.email} secondary={r.name} />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
}
