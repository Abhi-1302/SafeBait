import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from 'chart.js';
import api from '../api/api.tsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data));
  }, []);

  if (!stats) return <Typography>Loading...</Typography>;

  const userEmails = Object.keys(stats.campaignCounts || {});
  const campaignData = userEmails.map(e => stats.campaignCounts[e]);
  const audienceData = userEmails.map(e => stats.audienceCounts[e]);

  const barChartData = {
    labels: userEmails,
    datasets: [
      {
        label: 'Campaigns',
        backgroundColor: 'rgba(25, 118, 210, 0.8)',
        data: campaignData,
      },
      {
        label: 'Audiences',
        backgroundColor: 'rgba(67, 160, 71, 0.8)',
        data: audienceData,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Campaigns & Audiences Per User' },
    },
    scales: { x: { title: { display: true, text: 'User' } }, y: { beginAtZero: true } }
  };

  // Calculate engagement rates
  const clickRate = stats.totalInteractions ? Math.round(100 * stats.clicked / stats.totalInteractions) : 0;
  const reportRate = stats.totalInteractions ? Math.round(100 * stats.reported / stats.totalInteractions) : 0;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={6} md={3}><Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h6">Users</Typography>
          <Typography variant="h3">{stats.userCount}</Typography>
        </Paper></Grid>
        <Grid item xs={6} md={3}><Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h6">Campaigns</Typography>
          <Typography variant="h3">{stats.campaignCount}</Typography>
        </Paper></Grid>
        <Grid item xs={6} md={3}><Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h6">Audiences</Typography>
          <Typography variant="h3">{stats.audienceCount}</Typography>
        </Paper></Grid>
        <Grid item xs={6} md={3}><Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h6">Templates</Typography>
          <Typography variant="h3">{stats.templateCount}</Typography>
        </Paper></Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Bar data={barChartData} options={barChartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>Interaction Stats</Typography>
            <Typography>Total Interactions: {stats.totalInteractions}</Typography>
            <Typography>Clicked: {stats.clicked} ({clickRate}%)</Typography>
            <Typography>Reported: {stats.reported} ({reportRate}%)</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
