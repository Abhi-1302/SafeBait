import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Container, Typography, CircularProgress } from "@mui/material";
import api from "../api/api.tsx";

export default function ReportPhishingPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id || !token) return;
    setLoading(true);
    api.post(`/reportPhishing/${id}`, { token })
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
      <Typography variant="h4" fontWeight={700} mb={3}>
        Thank you for reporting!
      </Typography>
      <Typography>
        This was a <strong>simulated phishing campaign</strong> as part of your organization's security awareness program.<br /><br />
        By reporting this message, you have taken an important step to protect yourself and your company.<br />
        Thank you for staying vigilant and keeping your organization safe.
      </Typography>
    </Container>
  );
}
