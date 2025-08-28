import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  Typography
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";

export interface CampaignSummary {
  id: number;
  name: string;
  status: string;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
}

interface CampaignListProps {
  campaigns: CampaignSummary[];
}

export default function CampaignList({ campaigns }: CampaignListProps) {
  const navigate = useNavigate();

  return (
    <Paper elevation={1} sx={{ borderRadius: 2 }}>
      <List>
        {campaigns.map((c) => (
          <ListItem
            button
            divider
            key={c.id}
            onClick={() => navigate(`/campaigns/${c.id}`)}
          >
            <EmailIcon color="secondary" sx={{ mr: 2 }} />
            <ListItemText
              primary={
                <Typography fontWeight={600}>{c.name}</Typography>
              }
              secondary={
                <>
                  <span>{c.totalSent} sent</span>
                  <span style={{ marginLeft: 18 }}>{c.totalOpened} opened</span>
                  <span style={{ marginLeft: 18 }}>{c.totalClicked} clicked</span>
                </>
              }
            />
            <Chip
              label={c.status.toUpperCase()}
              color={
                c.status === "active"
                  ? "primary"
                  : c.status === "completed"
                  ? "success"
                  : "warning"
              }
              sx={{ ml: 2, fontWeight: 700 }}
              size="small"
            />
          </ListItem>
        ))}
        {campaigns.length === 0 && (
          <ListItem>
            <ListItemText
              primary="No campaigns yet. Start your first simulation!"
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
}
