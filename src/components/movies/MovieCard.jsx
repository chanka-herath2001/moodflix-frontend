import { Favorite, FavoriteBorder } from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Checkbox,
    Typography,
} from '@mui/material';

const MovieCard = ({ movie, selected, onToggle }) => {
  return (
    <Card
      onClick={onToggle}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        border: selected ? '3px solid #ec4899' : '3px solid transparent',
        transform: selected ? 'scale(0.95)' : 'scale(1)',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 24px rgba(236, 72, 153, 0.4)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="300"
        image={movie.poster_url}
        alt={movie.title}
        sx={{ objectFit: 'cover' }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '50%',
        }}
      >
        <Checkbox
          checked={selected}
          icon={<FavoriteBorder />}
          checkedIcon={<Favorite sx={{ color: '#ec4899' }} />}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        />
      </Box>

      <CardContent
        sx={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {movie.title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;