import React from "react";
import { CircularProgress, Box } from "@mui/material";

export default function LoadingSpinner() {
  return (
    <Box
      sx={{
        height: "100%",
        minHeight: "200px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
