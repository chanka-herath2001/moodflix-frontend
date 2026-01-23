import { AutoAwesome, Favorite, Feedback, History } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Typography
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/NavBar';
import MovieGrid from '../components/movies/MovieGrid';
import CSVImport from '../components/music/CSVImport';
import SongList from '../components/music/SongList';
import SpotifySearch from '../components/music/SpotifySearch';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { removeDuplicateSongs } from '../utils/csvParser';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useNotification();

  const [songs, setSongs] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [moviePool, setMoviePool] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [recentRecommendations, setRecentRecommendations] = useState(null);

  // 🔥 Progress bar state
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);

  const FEEDBACK_FORM_URL = 'https://forms.gle/hexWyezcV1wt55CC9';

  useEffect(() => {
    loadUserData();
    loadMovies();
    loadRecentRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    try {
      const [savedSongs, savedMovies] = await Promise.all([
        api.getUserSongs(),
        api.getFavoriteMovies(),
      ]);

      if (savedSongs.length > 0) {
        setSongs(savedSongs.map(s => ({ ...s, id: s.id || `${s.title}-${s.artist}` })));
      }
      if (savedMovies.length > 0) {
        setSelectedMovies(savedMovies.map(m => ({
          title: m.movie_title,
          poster_url: m.poster_url
        })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadRecentRecommendations = async () => {
    if (!user) return;
    try {
      const history = await api.getRecommendationHistory();
      if (history?.length) {
        setRecentRecommendations(history[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadMovies = async () => {
    try {
      const movies = await api.getMovies();
      setMoviePool(movies);
    } catch {
      showError('Failed to load movies');
    } finally {
      setLoadingMovies(false);
    }
  };

  // ============================
  // 🚀 PROGRESS BAR LOGIC
  // ============================

  const startProgress = () => {
    setProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 2; // smooth + organic
      });
    }, 800);
  };

  const finishProgress = async () => {
    clearInterval(progressIntervalRef.current);
    setProgress(100);
    await new Promise(res => setTimeout(res, 400)); // tiny pause for UX
  };

  const handleGetRecommendations = async () => {
    if (songs.length === 0) {
      showError('Please add at least one song!');
      return;
    }

    setLoading(true);
    startProgress();

    try {
      const selectedTitles = selectedMovies.map(m => m.title);
      const recommendations = await api.getRecommendations(songs, selectedTitles);

      await storage.setUserPreferences(user.id, {
        lastRecommendations: recommendations,
        timestamp: new Date().toISOString(),
      });

      await loadRecentRecommendations();
      await finishProgress();

      showSuccess('Got your perfect matches! ✨');

      navigate('/results', {
        state: { recommendations }
      });
    } catch (error) {
      clearInterval(progressIntervalRef.current);
      setProgress(0);
      showError('Failed to get recommendations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFeedback = () => {
    window.open(FEEDBACK_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>

        {/* HEADER */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 4,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 900, fontSize: { xs: '2rem', sm: '3rem' } }}>
            Build Your Music Profile
          </Typography>

          <Button
            variant="outlined"
            startIcon={<Feedback />}
            onClick={handleOpenFeedback}
            sx={{
              borderColor: '#ec4899',
              color: '#ec4899',
              '&:hover': { bgcolor: 'rgba(236,72,153,0.1)' },
            }}
          >
            Give Feedback
          </Button>
        </Box>

      

        {/* ===== REST OF YOUR UI (UNCHANGED) ===== */}

        {/* RECENT RECOMMENDATIONS */}
        {recentRecommendations && (
          <Card sx={{ mb: 4, bgcolor: 'rgba(236,72,153,0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                <History sx={{ mr: 1, color: '#ec4899' }} />
                Your Last Recommendations
              </Typography>
              <Grid container spacing={2}>
                {recentRecommendations.recommendations?.slice(0, 5).map((movie, idx) => (
                  <Grid item xs={6} sm={4} md={2.4} key={idx}>
                    <Card>
                      <CardMedia component="img" height={180} image={movie.poster_url} />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* FAVORITE MOVIES (NOT DROPPED 😤) */}
        {selectedMovies.length > 0 && (
          <Card sx={{ mb: 4, bgcolor: 'rgba(168,85,247,0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                <Favorite sx={{ mr: 1, color: '#a855f7' }} />
                Your Favorite Movies ({selectedMovies.length})
              </Typography>
              <Grid container spacing={2}>
                {selectedMovies.slice(0, 6).map((movie, idx) => (
                  <Grid item xs={6} sm={4} md={2} key={idx}>
                    <Card>
                      <CardMedia component="img" height={160} image={movie.poster_url} />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* MUSIC + MOVIES GRID */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Card><CardContent>
              <SpotifySearch onAddSong={song => setSongs([...songs, song])} />
              <Divider sx={{ my: 3 }} />
              <CSVImport onImport={songs => setSongs(removeDuplicateSongs(songs))} />
              <Divider sx={{ my: 3 }} />
              <SongList songs={songs} onRemoveSong={id => setSongs(s => s.filter(x => x.id !== id))} />
            </CardContent></Card>
          </Grid>

          <Grid item xs={12} lg={6}>
  <Card>
    <CardContent>
      {loadingMovies ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{
            maxHeight: { xs: 400, sm: 600 },
            overflow: 'auto',
          }}
        >
          <MovieGrid
            movies={moviePool}
            selectedMovies={selectedMovies}
            onToggleMovie={movie =>
              setSelectedMovies(prev =>
                prev.find(m => m.title === movie.title)
                  ? prev.filter(m => m.title !== movie.title)
                  : [...prev, movie]
              )
            }
          />
        </Box>
      )}
    </CardContent>
  </Card>
</Grid>

        </Grid>

        {/* CTA BUTTON */}
<Box sx={{ textAlign: 'center', mt: 4 }}>
  {loading && (
    <Box sx={{ mb: 2, maxWidth: 520, mx: 'auto' }}>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: 'rgba(255,255,255,0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            background: 'linear-gradient(90deg, #ec4899, #a855f7)',
            transition: 'width 0.6s ease-in-out',
          },
        }}
      />
    </Box>
  )}

  <Button
    variant="contained"
    size="large"
    disabled={loading}
    onClick={handleGetRecommendations}
    startIcon={<AutoAwesome />}
    sx={{ px: 6, py: 2, fontSize: '1.2rem' }}
  >
    Get Movie Recommendations
  </Button>
</Box>

      </Container>

      <Footer />
    </Box>
  );
};

export default Dashboard;
