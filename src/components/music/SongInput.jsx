import { Add } from '@mui/icons-material';
import { Box, IconButton, TextField } from '@mui/material';
import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';

const SongInput = ({ onAddSong }) => {
  const [song, setSong] = useState({ title: '', artist: '' });
  const { showSuccess, showError } = useNotification();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!song.title.trim() || !song.artist.trim()) {
      showError('Please fill in both title and artist');
      return;
    }

    onAddSong({
      ...song,
      title: song.title.trim(),
      artist: song.artist.trim(),
      id: `${song.title}-${song.artist}-${Date.now()}`,
    });

    setSong({ title: '', artist: '' });
    showSuccess('Song added! 🎵');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        label="Song Title"
        value={song.title}
        onChange={(e) => setSong({ ...song, title: e.target.value })}
        onKeyPress={handleKeyPress}
        placeholder="e.g., Blinding Lights"
      />
      <TextField
        fullWidth
        label="Artist"
        value={song.artist}
        onChange={(e) => setSong({ ...song, artist: e.target.value })}
        onKeyPress={handleKeyPress}
        placeholder="e.g., The Weeknd"
      />
      <IconButton
        type="submit"
        sx={{
          background: 'linear-gradient(45deg, #ec4899 30%, #a855f7 90%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(45deg, #db2777 30%, #9333ea 90%)',
          },
        }}
      >
        <Add />
      </IconButton>
    </Box>
  );
};

export default SongInput;