import {
  AutoAwesome,
  Close,
  Favorite,
  Movie,
  MusicNote,
  Feedback,
  InfoOutlined,
  Login as LoginIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/NavBar';
import MovieGrid from '../components/movies/MovieGrid';
import MovieCard from '../components/movies/MovieCard';
import SpotifySearch from '../components/music/SpotifySearch';
import SongList from '../components/music/SongList';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

const Landing = () => {
  const navigate = useNavigate();
  const { user, login, signup } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [songs, setSongs] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [moviePool, setMoviePool] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMovies, setLoadingMovies] = useState(true);

  // Auth dialog state
  const [authDialog, setAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Progress bar state
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const progressIntervalRef = useRef(null);

  const FEEDBACK_FORM_URL = 'https://forms.gle/hexWyezcV1wt55CC9';

  const features = [
    {
      icon: <MusicNote sx={{ fontSize: 48, color: '#ec4899' }} />,
      title: 'Add Your Music',
      description: 'Build your profile using songs you actually listen to',
    },
    {
      icon: <Favorite sx={{ fontSize: 48, color: '#a855f7' }} />,
      title: 'Pick Movies You Love',
      description: 'Your favourites help guide better recommendations',
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 48, color: '#38bdf8' }} />,
      title: 'Emotion-Based Matching',
      description: 'Movies are suggested using emotional similarity, not ratings',
    },
  ];

  useEffect(() => {
    loadMovies();
  }, []);

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

  const startProgress = () => {
    setProgress(0);
    const messages = [
      'Fetching lyrics from Genius...',
      'Analyzing mood from lyrics...',
      'Finding perfect matches...',
      'Almost there...',
    ];

    let messageIndex = 0;
    setLoadingMessage(messages[0]);

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 3;

        // Change message at certain milestones
        if (newProgress > 25 && messageIndex === 0) {
          messageIndex = 1;
          setLoadingMessage(messages[1]);
        } else if (newProgress > 50 && messageIndex === 1) {
          messageIndex = 2;
          setLoadingMessage(messages[2]);
        } else if (newProgress > 75 && messageIndex === 2) {
          messageIndex = 3;
          setLoadingMessage(messages[3]);
        }

        return newProgress >= 90 ? prev : newProgress;
      });
    }, 800);
  };

  const finishProgress = async () => {
    clearInterval(progressIntervalRef.current);
    setProgress(100);
    setLoadingMessage('Complete!');
    await new Promise((res) => setTimeout(res, 400));
  };

  const handleGetRecommendations = async () => {
    if (songs.length === 0) {
      showError('Please add at least one song!');
      return;
    }

    setLoading(true);
    startProgress();

    try {
      const selectedTitles = selectedMovies.map((m) => m.title);
      const recommendations = await api.getRecommendations(songs, selectedTitles);

      await finishProgress();
      showSuccess('Got your perfect matches! ✨');

      navigate('/results', {
        state: { recommendations },
      });
    } catch (error) {
      clearInterval(progressIntervalRef.current);
      setProgress(0);
      setLoadingMessage('');
      showError('Failed to get recommendations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFeedback = () => {
    window.open(FEEDBACK_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if (authTab === 0) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        showSuccess(`Welcome back, ${result.user.name}! 👋`);
        setAuthDialog(false);
        navigate('/dashboard');
      } else {
        showError('Login failed. Please try again.');
      }
    } else {
      const result = await signup(
        formData.name,
        formData.email,
        formData.password
      );
      if (result.success) {
        showSuccess(`Welcome to MoodFlix, ${result.user.name}! 🎉`);
        setAuthDialog(false);
        navigate('/dashboard');
      } else {
        showError('Signup failed. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar onLoginClick={() => setAuthDialog(true)} />

      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 2, sm: 4 },
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%)',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {/* HERO SECTION */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mb: 3,
            }}
          >
            <MusicNote sx={{ fontSize: 56, color: '#ec4899' }} />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 900,
              }}
            >
              MoodFlix
            </Typography>
            <Movie sx={{ fontSize: 56, color: '#a855f7' }} />
          </Box>

          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
            Movie Recommendations Based on Your Music Mood
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 720,
              mx: 'auto',
              color: 'rgba(255,255,255,0.75)',
              mb: 3,
            }}
          >
            MoodFlix analyzes the emotional tone of the songs you love and 
            recommends movies that match your mood. By combining music emotion 
            detection with film sentiment analysis, MoodFlix creates personalized 
            movie suggestions that feel emotionally connected to your listening habits.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => setAuthDialog(true)}
              sx={{ px: 4, py: 1.5, fontSize: '1rem', borderRadius: 8 }}
            >
              Get Started
            </Button>

            <Button
              variant="outlined"
              startIcon={<Feedback />}
              onClick={handleOpenFeedback}
              sx={{
                borderColor: '#ec4899',
                color: '#ec4899',
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: 'rgba(236,72,153,0.1)' },
              }}
            >
              Give Feedback
            </Button>
          </Box>
        </Box>

        {/* DISCLAIMER */}
        <Card
          sx={{
            mb: 6,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <InfoOutlined sx={{ color: '#38bdf8', mb: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Work in Progress
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}
            >
              MoodFlix is an academic / portfolio project currently under active
              development. Recommendations may evolve, features may change, and results
              are experimental. Your feedback is highly appreciated!
            </Typography>
          </CardContent>
        </Card>

        {/* MUSIC + MOVIES SECTION */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* MUSIC SECTION */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  <MusicNote sx={{ mr: 1, verticalAlign: 'middle', color: '#ec4899' }} />
                  Your Music
                </Typography>

                <SpotifySearch onAddSong={(song) => setSongs([...songs, song])} />

                <Divider sx={{ my: 3 }} />

                <SongList
                  songs={songs}
                  onRemoveSong={(id) => setSongs((s) => s.filter((x) => x.id !== id))}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* FAVORITE MOVIES SECTION */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  <Favorite sx={{ mr: 1, verticalAlign: 'middle', color: '#a855f7' }} />
                  Your Favorite Movies (Optional)
                </Typography>

                {selectedMovies.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                      {selectedMovies.slice(0, 4).map((movie, idx) => (
                        <Grid item xs={6} key={idx}>
                          <MovieCard movie={movie} selected disableToggle />
                        </Grid>
                      ))}
                    </Grid>
                    {selectedMovies.length > 4 && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 2, color: 'text.secondary' }}
                      >
                        +{selectedMovies.length - 4} more selected
                      </Typography>
                    )}
                  </Box>
                )}

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Select movies you love to refine recommendations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* MOVIE SELECTION GRID */}
        <Card
          sx={{
            mb: 4,
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Browse Movies
            </Typography>

            {loadingMovies ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <LinearProgress />
              </Box>
            ) : (
              <Box sx={{ maxHeight: { xs: 400, sm: 600 }, overflow: 'auto' }}>
                <MovieGrid
                  movies={moviePool}
                  selectedMovies={selectedMovies}
                  onToggleMovie={(movie) => {
                    setSelectedMovies((prev) =>
                      prev.find((m) => m.title === movie.title)
                        ? prev.filter((m) => m.title !== movie.title)
                        : [...prev, movie]
                    );
                  }}
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* CTA BUTTON WITH PROGRESS */}
        <Box sx={{ textAlign: 'center', mt: 4, mb: 6 }}>
          {loading && (
            <Box sx={{ mb: 2, maxWidth: 520, mx: 'auto' }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: '#ec4899', fontWeight: 600 }}
              >
                {loadingMessage}
              </Typography>
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

        {/* HOW IT WORKS */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>
            How It Works
          </Typography>
          <Grid container spacing={2}>
            {[
              { step: '1', text: 'Add songs you listen to' },
              { step: '2', text: 'Optionally select movies you enjoy' },
              { step: '3', text: 'Explore emotion-based matches' },
            ].map((item) => (
              <Grid item xs={12} md={4} key={item.step}>
                <Box
                  sx={{
                    p: 3,
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Typography variant="h5" sx={{ color: '#ec4899', mb: 1 }}>
                    {item.step}
                  </Typography>
                  <Typography variant="body2">{item.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FEATURES */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* AUTH DIALOG */}
      <Dialog
        open={authDialog}
        onClose={() => setAuthDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'rgba(15, 23, 42, 0.95)',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {authTab === 0 ? 'Welcome Back' : 'Create an Account'}
            </Typography>
            <Button onClick={() => setAuthDialog(false)}>
              <Close />
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Tabs
            value={authTab}
            onChange={(e, v) => setAuthTab(v)}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          <Box component="form" onSubmit={handleAuthSubmit}>
            {authTab === 1 && (
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
            )}
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
              {authTab === 0 ? 'Login' : 'Sign Up'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default Landing;