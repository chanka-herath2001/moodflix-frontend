import { BugReport, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Button, Collapse, Paper, Typography } from '@mui/material';
import { useState } from 'react';

/**
 * Debug panel to show app state - remove in production
 */
const DebugPanel = ({ data, title = 'Debug Info' }) => {
  const [open, setOpen] = useState(false);

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 400,
        maxHeight: 600,
        overflow: 'auto',
        zIndex: 9999,
        bgcolor: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid #ec4899',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(236, 72, 153, 0.3)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BugReport sx={{ color: '#ec4899' }} />
          <Typography variant="h6" sx={{ color: '#ec4899' }}>
            {title}
          </Typography>
        </Box>
        <Button
          size="small"
          onClick={() => setOpen(!open)}
          endIcon={open ? <ExpandLess /> : <ExpandMore />}
          sx={{ color: 'white' }}
        >
          {open ? 'Hide' : 'Show'}
        </Button>
      </Box>

      <Collapse in={open}>
        <Box sx={{ p: 2 }}>
          <pre
            style={{
              color: '#fff',
              fontSize: '12px',
              overflow: 'auto',
              margin: 0,
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default DebugPanel;