import { Movie as MovieIcon, Search } from '@mui/icons-material';
import { Box, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, selectedMovies, onToggleMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search movies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {filteredMovies.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}
        >
          <MovieIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
          <Typography variant="h6">No movies found</Typography>
          <Typography variant="body2">Try a different search term</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredMovies.map((movie) => (
            <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.title}>
              <MovieCard
                movie={movie}
                selected={selectedMovies.some((m) => m.title === movie.title)}
                onToggle={() => onToggleMovie(movie)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MovieGrid;