import { ArrowBack, EmojiEmotions, SentimentDissatisfied, Spa, Whatshot } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/NavBar';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';

const emotionIcons = {
  happy: <EmojiEmotions />,
  sad: <SentimentDissatisfied />,
  angry: <Whatshot />,
  relaxed: <Spa />,
};

const emotionColors = {
  happy: '#fbbf24',
  sad: '#60a5fa',
  angry: '#ef4444',
  relaxed: '#34d399',
};

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const loadRecommendations = async () => {
    console.log('📍 Results page - Loading recommendations...');
    console.log('Location state:', location.state);
    
    try {
      // First try to get from navigation state
      if (location.state?.recommendations) {
        console.log('✅ Got recommendations from navigation state');
        setRecommendations(location.state.recommendations);
        setLoading(false);
        return;
      }

      // Then try storage (only if user is logged in)
      if (user) {
        console.log('🔍 Checking storage for user:', user.id);
        const prefs = await storage.getUserPreferences(user.id);
        console.log('Storage preferences:', prefs);
        
        if (prefs && prefs.lastRecommendations) {
          console.log('✅ Got recommendations from storage');
          setRecommendations(prefs.lastRecommendations);
          setLoading(false);
          return;
        }
      }

      // No recommendations found
      console.log('❌ No recommendations found, redirecting');
      navigate(user ? '/dashboard' : '/', { replace: true });
      
    } catch (error) {
      console.error('❌ Failed to load recommendations:', error);
      navigate(user ? '/dashboard' : '/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <Typography>Loading recommendations...</Typography>
        </Box>
      </Box>
    );
  }

  if (!recommendations) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            No recommendations found
          </Typography>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </Container>
      </Box>
    );
  }

  console.log('🎬 Rendering results with:', recommendations);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
            }}
          >
            Your Perfect Matches ✨
          </Typography>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/dashboard')}
            variant="outlined"
          >
            Back to Dashboard
          </Button>
        </Box>

        {/* Mood Profile */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              Your Mood Profile
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(recommendations.ensemble).map(([emotion, value]) => (
                <Grid item xs={6} md={3} key={emotion}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        fontSize: 48,
                        mb: 1,
                        color: emotionColors[emotion],
                      }}
                    >
                      {emotionIcons[emotion]}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        textTransform: 'capitalize',
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      {emotion}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={value * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        mb: 1,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: emotionColors[emotion],
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {(value * 100).toFixed(0)}%
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          Recommended Movies
        </Typography>
        <Grid container spacing={3}>
          {recommendations.recommendations.map((movie, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={movie.poster_url}
                    alt={movie.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Chip
                    label={`#${index + 1}`}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: '#ec4899',
                      color: 'white',
                      fontWeight: 700,
                    }}
                  />
                </Box>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {movie.title}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Match Score
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={movie.final_score * 100}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        mb: 0.5,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {(movie.final_score * 100).toFixed(0)}%
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {Object.entries(movie)
                      .filter(([key]) => ['happy', 'sad', 'angry', 'relaxed'].includes(key))
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 2)
                      .map(([emotion, value]) => (
                        <Chip
                          key={emotion}
                          label={emotion}
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            bgcolor: `${emotionColors[emotion]}33`,
                            color: emotionColors[emotion],
                          }}
                        />
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer/>
    </Box>
  );
};

export default Results;