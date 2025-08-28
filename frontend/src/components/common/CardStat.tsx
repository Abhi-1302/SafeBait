import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface StatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function CardStat({ label, value, icon, sx }: StatProps) {
  return (
    <Paper elevation={2} sx={{ borderRadius: 2, px: 2.5, py: 2, ...sx }}>
      <Box display="flex" alignItems="center" gap={2}>
        {icon}
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {value}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
