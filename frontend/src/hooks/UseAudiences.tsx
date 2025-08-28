import { useState, useEffect } from "react";
import api from "../api/api.tsx";

export interface Audience {
  id: number;
  name: string;
  description: string;
  recipientsCount: number;
}

export function useAudiences() {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/audiences")
      .then((res) => setAudiences(res.data || []))
      .catch(() => setError("Failed to fetch audiences"))
      .finally(() => setLoading(false));
  }, []);

  return { audiences, loading, error };
}
