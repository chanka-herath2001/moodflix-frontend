import { Delete, MusicNote } from '@mui/icons-material';
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';

const SongList = ({ songs, onRemoveSong }) => {
  if (songs.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
          color: 'text.secondary',
        }}
      >
        <MusicNote sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
        <Typography variant="body1">No songs added yet</Typography>
        <Typography variant="body2">Start by adding your favorite tracks!</Typography>
      </Box>
    );
  }

  return (
    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
      {songs.map((song) => (
        <ListItem
          key={song.id}
          component={Paper}
          sx={{
            mb: 1,
            background: 'rgba(255, 255, 255, 0.03)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
            },
          }}
          secondaryAction={
            <IconButton
              edge="end"
              onClick={() => onRemoveSong(song.id)}
              sx={{ color: 'error.main' }}
            >
              <Delete />
            </IconButton>
          }
        >
          <ListItemText
            primary={song.title}
            secondary={song.artist}
            primaryTypographyProps={{
              fontWeight: 600,
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default SongList;