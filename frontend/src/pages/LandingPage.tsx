import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Container, Typography, CircularProgress, Button } from "@mui/material";
import api from "../api/api.tsx";

export default function LandingPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    api.post(`/landing/${id}`, { token })
      .then(() => setSubmitted(true))
      .catch(() => setSubmitted(true))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (!token)
    return (
      <Container sx={{ mt: 12 }}>
        <Typography color="error" align="center">
          Invalid or missing token.
        </Typography>
      </Container>
    );

  if (loading)
    return (
      <Container sx={{ mt: 12 }}>
        <CircularProgress />
      </Container>
    );

  if (!submitted) return null;

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Typography variant="h3" fontWeight={800} align="center" gutterBottom>
        🚨 Important Notice 🚨
      </Typography>
      <Typography align="center" sx={{ mb: 4, fontSize: 21 }}>
        This is a <strong>simulated phishing test</strong> for your awareness.<br />
        If you reached this page, your interaction has been tracked.<br />
        Please review security guidance to keep yourself and your organization safe.
      </Typography>
      <Button variant="contained" color="primary" fullWidth disabled>
        Thank you for participating
      </Button>
    </Container>
  );
}
