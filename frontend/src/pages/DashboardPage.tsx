import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Fab,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import api from "../api/api.tsx";
import CardStat from "../components/common/CardStat.tsx";
import AnalyticsChart from "../components/AnalyticsChart.tsx";

interface Campaign {
  id: number;
  name: string;
  status: string;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/campaigns")
      .then((res) => setCampaigns(res.data || []))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, []);

  const totalSent = campaigns.reduce((a, c) => a + (c.totalSent || 0), 0);
  const totalClicked = campaigns.reduce((a, c) => a + (c.totalClicked || 0), 0);

  const chartData = campaigns.map((c) => ({
    label: c.name,
    value: c.totalClicked,
  }));

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Paper elevation={1} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={700}>
            Dashboard
          </Typography>
          <Fab variant="extended" color="primary" href="/campaigns/new">
            <AddIcon sx={{ mr: 1 }} /> New Campaign
          </Fab>
        </Box>
      </Paper>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <CardStat label="Total Campaigns" value={campaigns.length} />
        </Grid>
        <Grid item xs={12} md={4}>
          <CardStat label="Emails Sent" value={totalSent} />
        </Grid>
        <Grid item xs={12} md={4}>
          <CardStat label="Total Clicks" value={totalClicked} />
        </Grid>
        <Grid item xs={12} md={12} sx={{ mt: 4 }}>
          <AnalyticsChart data={chartData} label="Clicks per Campaign" />
        </Grid>
      </Grid>
    </Container>
  );
}
