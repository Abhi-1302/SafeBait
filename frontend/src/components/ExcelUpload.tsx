import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Box,
} from "@mui/material";
import * as XLSX from "xlsx";

interface ExcelUploadProps {
  onUpload: (recipients: { email: string; name?: string }[]) => void;
}

export default function ExcelUpload({ onUpload }: ExcelUploadProps) {
  const [open, setOpen] = useState(false);
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [emailCol, setEmailCol] = useState("");
  const [nameCol, setNameCol] = useState("");
  const [error, setError] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (!bstr) return;
      try {
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
        if (!data.length) {
          setError("Excel sheet is empty");
          return;
        }
        setRows(data);
        setColumns(Object.keys(data[0]));
        setEmailCol("");
        setNameCol("");
        setError("");
        setOpen(true);
      } catch {
        setError("Failed to parse Excel file");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    if (!emailCol) {
      setError("Please select the email column");
      return;
    }
    const recipients = rows.map(row => ({
      email: row[emailCol]?.toString().trim(),
      name: nameCol ? row[nameCol]?.toString().trim() : "",
    }))
      .filter(r => r.email); 
    onUpload(recipients);
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" component="label" size="small">
        Upload Excel
        <input type="file" hidden accept=".xlsx,.xls" onChange={handleFile} />
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Map Excel Columns</DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>Email Column</InputLabel>
              <Select
                value={emailCol}
                label="Email Column"
                onChange={(e) => setEmailCol(e.target.value)}
              >
                {columns.map(col => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Name Column</InputLabel>
              <Select
                value={nameCol}
                label="Name Column"
                onChange={(e) => setNameCol(e.target.value)}
              >
                <MenuItem value="">(None)</MenuItem>
                {columns.map(col => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Preview of first 3 rows:
          </Typography>
          <Box sx={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ccc", p: 1, mt: 1 }}>
            {rows.slice(0, 3).map((row, i) => (
              <Box key={i} sx={{ fontSize: 14 }}>
                {columns.map(c => (
                  <span key={c} style={{ marginRight: 10 }}>
                    <b>{c}:</b> {row[c]?.toString().slice(0, 15)}
                  </span>
                ))}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleImport} disabled={!emailCol}>
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
