import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

type Props = {
  htmlContent: string;
};

const TemplatePreview: React.FC<Props> = ({ htmlContent }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="subtitle1" gutterBottom>
        Preview:
      </Typography>
      <Paper
        variant="outlined"
        sx={{ p: 2, minHeight: 100, marginBottom: 2 }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{ whiteSpace: 'normal' }}
        />
      </Paper>
    </Box>
  );
};

export default TemplatePreview;
