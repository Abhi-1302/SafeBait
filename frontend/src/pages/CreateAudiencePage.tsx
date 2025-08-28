import React from "react";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AudienceForm from "../components/AudienceForm";
import { useNotification } from "../context/NotificationContext";

export default function CreateAudiencePage() {
  const navigate = useNavigate();
  const { notify } = useNotification();

  const onCreated = () => {
    notify("Audience created successfully!","success");
    navigate("/audiences");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" mb={3} fontWeight={700}>
        Create New Audience
      </Typography>
      <AudienceForm onCreated={onCreated} />
    </Container>
  );
}
