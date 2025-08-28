import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  LinearProgress,
} from "@mui/material";
import api from "../api/api.tsx";
import { useNotification } from "../context/NotificationContext.tsx";

interface CSVUploadProps {
  audienceId: number;
  onUploaded: () => void;
}

export default function CSVUpload({ audienceId, onUploaded }: CSVUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { notify } = useNotification();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post(`/audiences/${audienceId}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFile(null);
      onUploaded();
    } catch (error) {
      notify("Upload failed","error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 2, border: "1px dashed grey", borderRadius: 1, mb: 2 }}>
      <Typography variant="body1" mb={1}>
        Upload Recipients CSV (email,name)
      </Typography>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {file && (
        <Box mt={1} display="flex" alignItems="center" gap={1}>
          <Typography>{file.name}</Typography>
          <Button onClick={handleUpload} variant="contained" size="small" disabled={uploading}>
            Upload
          </Button>
        </Box>
      )}

      {uploading && <LinearProgress sx={{ mt: 1 }} />}
    </Box>
  );
}
