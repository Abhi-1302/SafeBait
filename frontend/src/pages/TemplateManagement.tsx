import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TemplatePreview from '../components/TemplatePreiew.tsx';
import api from '../api/api.tsx';
import { useNotification } from '../context/NotificationContext.tsx';

// Banner string must exactly match backend's expected banner
const banner = `<div style="background:#fff3cd;padding:12px;border-radius:6px;margin-bottom:18px;font-size:16px;">
<b>Suspicious?</b> <a href="{{reportLink}}" style="color:#d32f2f;font-weight:bold">Report this as Phishing</a>
</div>`;

export default function TemplateManagement() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [activeEditId, setActiveEditId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [contentBody, setContentBody] = useState('');
  const { notify } = useNotification();

  useEffect(() => {
    api.get('/admin/templates').then(res => setTemplates(res.data));
  }, []);

  const isValidContent = (content: string): boolean => {
    if (!content.startsWith(banner)) {
      notify('Content must start with the predefined banner.', 'error');
      return false;
    }
    const anchorCount = (content.match(/<a href="{{link}}">/g) || []).length;
    if (anchorCount !== 1) {
      notify('Content must contain exactly one <a href="{{link}}"> tag.', 'error');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!name.trim() || !category.trim() || !subject.trim()) {
      notify('Name, category, and subject are required.', 'warning');
      return;
    }
    if (!isValidContent(contentBody)) return;

    try {
      if (activeEditId) {
        const res = await api.put(`/admin/templates/${activeEditId}`, {
          name,
          category,
          subject,
          content: contentBody,
        });
        setTemplates(templates.map(t => (t.id === activeEditId ? res.data : t)));
        notify('Template updated successfully!', 'success');
      } else {
        const res = await api.post('/admin/templates', {
          name,
          category,
          subject,
          content: contentBody,
        });
        setTemplates([...templates, res.data]);
        notify('Template added successfully!', 'success');
      }
      clearForm();
    } catch {
      notify('Failed to save template.', 'error');
    }
  };

  const handleEdit = (tpl: any) => {
    setActiveEditId(tpl.id);
    setName(tpl.name);
    setCategory(tpl.category);
    setSubject(tpl.subject);
    setContentBody(tpl.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearForm = () => {
    setActiveEditId(null);
    setName('');
    setCategory('');
    setSubject('');
    setContentBody('');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Templates
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {activeEditId ? 'Edit Template' : 'Add New Template'}
        </Typography>

        {!activeEditId && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Banner (readonly):
            </Typography>
            <div
              dangerouslySetInnerHTML={{ __html: banner }}
              style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', 
                userSelect: 'all', cursor: 'text', border: '1px solid #ccc', padding: 8, borderRadius: 4 , backgroundColor: '#f9f9f9'}}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                navigator.clipboard.writeText(banner);
                notify('Banner copied to clipboard!', 'info');
              }}
              sx={{ mb: 2 }}
            >
              Copy Banner HTML
            </Button>
          </Box>
        )}

        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Category"
          fullWidth
          value={category}
          onChange={e => setCategory(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Subject"
          fullWidth
          value={subject}
          onChange={e => setSubject(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Full Template Content (include banner if needed)"
          value={contentBody}
          onChange={e => setContentBody(e.target.value)}
          fullWidth
          multiline
          rows={10}
          sx={{ mb: 2, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}
          placeholder={activeEditId ? undefined : 'Add your template body here after the banner...'}
        />
        <TemplatePreview htmlContent={contentBody} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mr: 1 }}
        >
          {activeEditId ? 'Save Changes' : 'Add Template'}
        </Button>
        {activeEditId && (
          <Button variant="outlined" color="secondary" onClick={clearForm}>
            Cancel Edit
          </Button>
        )}
      </Paper>

      <Typography variant="h6" gutterBottom>
        Existing Templates
      </Typography>
      <Paper>
        <List>
          {templates.length === 0 && (
            <Typography sx={{ p: 2 }}>No templates available.</Typography>
          )}
          {templates.map(tpl => (
            <ListItem
              key={tpl.id}
              divider
              secondaryAction={
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(tpl)}>
                  <EditIcon />
                </IconButton>
              }
            >
              <ListItemText primary={`${tpl.name} (${tpl.category})`} secondary={`Subject: ${tpl.subject}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>  
  );
}
