import { Add, MusicNote } from '@mui/icons-material';
import {
    Avatar,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNotification } from '../../context/NotificationContext';

const SpotifySearch = ({ onAddSong }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const { showError } = useNotification();

  // Spotify API credentials (Client Credentials Flow)
  const CLIENT_ID = '284daf4014c44fa8a890ffce2d4c4987'; // Replace with your Spotify Client ID
  const CLIENT_SECRET = 'ca066e5f792d407c9d9da19a16aa2663'; // Replace with your Spotify Client Secret

  useEffect(() => {
    getSpotifyToken();
  }, []);

  const getSpotifyToken = async () => {
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
          },
        }
      );
      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error('Failed to get Spotify token:', error);
      showError('Failed to connect to Spotify');
    }
  };

  useEffect(() => {
    if (!searchQuery || !accessToken) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchSpotify();
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [searchQuery, accessToken]);

  const searchSpotify = async () => {
    if (!searchQuery.trim() || !accessToken) return;

    setLoading(true);
    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: searchQuery,
          type: 'track',
          limit: 10,
        },
      });

      const tracks = response.data.tracks.items.map((track) => ({
        title: track.name,
        artist: track.artists.map((a) => a.name).join(', '),
        image: track.album.images[2]?.url || track.album.images[0]?.url,
        id: track.id,
      }));

      setSearchResults(tracks);
    } catch (error) {
      console.error('Spotify search error:', error);
      if (error.response?.status === 401) {
        // Token expired, get new one
        await getSpotifyToken();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTrack = (track) => {
    onAddSong({
      title: track.title,
      artist: track.artist,
      id: `${track.title}-${track.artist}-${Date.now()}`,
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        placeholder="Select 5 songs from Spotify..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          endAdornment: loading && <CircularProgress size={20} />,
        }}
      />

      {searchResults.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 400,
            overflow: 'auto',
            bgcolor:'#000000',
            mt: 1,
          }}
        >
          <List>
            {searchResults.map((track) => (
              <ListItem
                key={track.id}
                button
                onClick={() => handleSelectTrack(track)}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(236, 72, 153, 0.1)',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={track.image}
                    variant="rounded"
                    sx={{ bgcolor: '#ec4899' }}
                  >
                    <MusicNote />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={track.title}
                  secondary={track.artist}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    noWrap: true,
                  }}
                  secondaryTypographyProps={{
                    noWrap: true,
                  }}
                />
                <Add sx={{ color: '#ec4899' }} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {searchQuery && !loading && searchResults.length === 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 1,
            p: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No results found
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default SpotifySearch;