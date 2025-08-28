import { useState, useEffect } from "react";
import api from "../api/api.tsx";

export function useFetch<T = any>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get(endpoint)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || "Error"))
      .finally(() => setLoading(false));
  }, [endpoint]);
  return { data, loading, error };
}
