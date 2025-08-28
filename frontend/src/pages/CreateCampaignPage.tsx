import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CampaignForm from "../components/CampaignForm.tsx";
import { useNotification } from "../context/NotificationContext.tsx";

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const { notify } = useNotification();

  const onCreated = () => {
    notify("Campaign created successfully!","success");
    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" mb={3} fontWeight={700}>
        Create New Campaign
      </Typography>
      <Box>
        <CampaignForm onSubmit={onCreated} />
      </Box>
    </Container>
  );
}
