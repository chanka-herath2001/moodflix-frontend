import { CloudDownload } from '@mui/icons-material';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { lastfmService } from '../../services/lastfm';

const LastFmImport = ({ onImport }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleImport = async () => {
    if (!username.trim()) {
      showError('Please enter a Last.fm username');
      return;
    }

    setLoading(true);
    try {
      const tracks = await lastfmService.getTopTracks(username, 20);
      onImport(tracks);
      showSuccess(`Imported ${tracks.length} tracks from Last.fm! 🎧`);
      setUsername('');
    } catch (error) {
      showError(error.message || 'Failed to import tracks from Last.fm');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleImport();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        label="Last.fm Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
        placeholder="Enter your Last.fm username"
      />
      <Button
        variant="contained"
        onClick={handleImport}
        disabled={loading || !username.trim()}
        startIcon={loading ? <CircularProgress size={20} /> : <CloudDownload />}
        sx={{ minWidth: 120 }}
      >
        {loading ? 'Importing...' : 'Import'}
      </Button>
    </Box>
  );
};

export default LastFmImport;