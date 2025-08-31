import React, { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import api from "../api/api.tsx";
import CampaignList, { CampaignSummary } from "../components/CampaignList.tsx";
import LoadingSpinner from "../components/common/LoadingSpinner.tsx";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/CustomButton.tsx";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    api.get("/campaigns")
      .then((res) => setCampaigns(res.data || []))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Campaigns
        </Typography>
        <Button color="primary" onClick={() => navigate("/campaigns/new")} startIcon={<AddIcon />}>
          Create
        </Button>
      </Box>
      {loading ? <LoadingSpinner /> : <CampaignList campaigns={campaigns} />}
    </Container>
  );
}
