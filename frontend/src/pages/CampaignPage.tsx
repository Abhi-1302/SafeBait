import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Divider,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Button from "../components/common/CustomButton.tsx";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import { useParams } from "react-router-dom";
import api from "../api/api.tsx";
import { useNotification } from "../context/NotificationContext.tsx";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CampaignPage() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [sending, setSending] = useState(false);
  const { notify } = useNotification();
  const chartData = {
  labels: ["Sent", "Opened", "Clicked", "Reported"],
  datasets: [
    {
      label: "Interactions",
      data: [
        campaign?.totalSent || 0,
        campaign?.totalOpened || 0,
        campaign?.totalClicked || 0,
        campaign?.totalReported || 0
      ],
      backgroundColor: [
        "rgba(25, 118, 210, 0.8)",
        "rgba(67, 160, 71, 0.8)",
        "rgba(251, 140, 0, 0.8)",
        "rgba(211, 47, 47, 0.8)"
      ],
      borderRadius: 8,
      barThickness: 40,
    }
  ]
};
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: "Campaign Interactions" }
  },
  scales: {
    y: { beginAtZero: true, precision: 0 }
  }
};
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/campaigns/${id}`)
      .then((res) => {
        setCampaign(res.data.campaign);
        setNotFound(false);
      })
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
        setCampaign(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendCampaign = async () => {
    if (!campaign) return;
    setSending(true);
    try {
      await api.post(`/campaigns/${id}/send`);
      notify("Campaign emails sent!", "success");
      api.get(`/campaigns/${id}`).then((res) => setCampaign(res.data.campaign));
    } catch {
      notify("Failed to send campaign emails.", "error");
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <Container sx={{ mt: 6 }}>
        <Typography align="center">
          <CircularProgress />
        </Typography>
      </Container>
    );

  if (notFound)
    return (
      <Container sx={{ mt: 6 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          Campaign not found.
        </Typography>
      </Container>
    );

  if (!campaign)
    return (
      <Container sx={{ mt: 6 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          Nothing to show here.
        </Typography>
      </Container>
    );

  const audienceName = campaign.audience?.name || "N/A";
  const templateName = campaign.template?.name || "N/A";
  const canSend =
    campaign.status === "active" &&
    campaign.audience &&
    campaign.template &&
    (campaign.audience.recipients?.length ?? 0) > 0;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box flex={1}>
            <Typography variant="h5" fontWeight={700}>
              {campaign.name}
            </Typography>
            <Typography color="text.secondary">
              Audience: {audienceName}
            </Typography>
            <Typography color="text.secondary">
              Template: {templateName}
            </Typography>
          </Box>
          <Box mt={{ xs: 2, md: 0 }}>
            <Chip
              label={campaign.status.toUpperCase()}
              color={
                campaign.status === "completed"
                  ? "success"
                  : campaign.status === "active"
                  ? "primary"
                  : "warning"
              }
              size="medium"
              sx={{ mr: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendCampaign}
              disabled={!canSend || sending}
            >
              {sending ? <CircularProgress size={22} /> : "Send Campaign"}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2">Sent</Typography>
            <Typography variant="h6">{campaign.totalSent}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2">Opened</Typography>
            <Typography variant="h6">{campaign.totalOpened}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2">Clicked</Typography>
            <Typography variant="h6">{campaign.totalClicked}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2">Fastest Report</Typography>
            <Box>
              {campaign.fastestReport ? (
                <>
                  <Typography>
                    {campaign.fastestReport.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(campaign.fastestReport.reportedAt).toLocaleString()}
                  </Typography>
                </>
              ) : (
                <Typography variant="h6">No reports yet</Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Recipient Interactions
        </Typography>

        <TableContainer component={Paper}>
          <Table size="small" aria-label="recipient interactions table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Recipient Email</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Clicked</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Reported</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Submitted</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaign.interactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    Nothing to show here.
                  </TableCell>
                </TableRow>
              ) : (
                campaign.interactions.map((interaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{interaction.recipientEmail}</TableCell>
                    <TableCell align="center">{interaction.clicked ? "Yes" : "No"}</TableCell>
                    <TableCell align="center">{interaction.reported ? "Yes" : "No"}</TableCell>
                    <TableCell align="center">{interaction.submitted ? "Yes" : "No"}</TableCell>
                    <TableCell>{interaction.name}</TableCell>
                    <TableCell>{interaction.timestamp ? new Date(interaction.timestamp).toLocaleString() : "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Bar data={chartData} options={chartOptions} />
    </Container>
  );
}
