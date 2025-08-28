import { useState, useEffect } from "react";
import api from "../api/api.tsx";

export interface Campaign {
  id: number;
  name: string;
  status: string;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/campaigns")
      .then((res) => setCampaigns(res.data || []))
      .catch(() => setError("Failed to fetch campaigns"))
      .finally(() => setLoading(false));
  }, []);

  return { campaigns, loading, error };
}
