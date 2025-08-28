import React, { ErrorInfo } from "react";
import { Typography, Box } from "@mui/material";

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4" color="error" gutterBottom>
            Something went wrong.
          </Typography>
          <Typography>Please try refreshing the page.</Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}
