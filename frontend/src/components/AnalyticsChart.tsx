import React from "react";
import { Line } from "react-chartjs-2";
import { Paper, Typography, Box } from "@mui/material";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface Props {
  data: Array<{ label: string; value: number }>;
  label?: string;
}

export default function AnalyticsChart({ data, label }: Props) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: label || "Clicks",
        data: data.map((d) => d.value),
        fill: false,
        borderColor: "#1976d2",
        backgroundColor: "#1976d2",
        tension: 0.3,
        pointRadius: 5,
      }
    ]
  };
  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>
        {label || "Clicks Over Time"}
      </Typography>
      <Box>
        <Line data={chartData} options={{
          responsive: true,
          plugins: { legend: { display: false } }
        }} />
      </Box>
    </Paper>
  );
}
