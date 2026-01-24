import {
  AutoAwesome,
  Close,
  Favorite,
  Movie,
  MusicNote,
  Feedback ,
  InfoOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';




const Landing = () => {
  const navigate = useNavigate();
  const { user, login, signup } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [authDialog, setAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

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

  const handleOpenFeedback = () => {
    window.open(FEEDBACK_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  const FEEDBACK_FORM_URL = 'https://forms.gle/hexWyezcV1wt55CC9';

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

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* HERO */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
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
              sx={{ fontSize: { xs: '3rem', md: '4.2rem' }, fontWeight: 900 }}
            >
              MoodFlix
            </Typography>
            <Movie sx={{ fontSize: 56, color: '#a855f7' }} />
          </Box>

          <Typography
            variant="h6"
            sx={{ color: 'text.secondary', mb: 2 }}
          >
            Discover movies through your music taste
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 720,
              mx: 'auto',
              color: 'rgba(255,255,255,0.75)',
              mb: 4,
            }}
          >
            MoodFlix (placeholder name😂) is an experimental recommendation platform that connects
            music emotions with movie storytelling to explore how sound and
            cinema intersect.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => setAuthDialog(true)}
            sx={{ px: 6, py: 2, fontSize: '1.1rem', borderRadius: 8 }}
          >
            Try It Out
          </Button>
        </Box>

        {/* DISCLAIMER */}
        <Card
          sx={{
            mb: 8,
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
              MoodFlix is an academic / portfolio project currently under
              active development. Recommendations may evolve, features may
              change, and results are experimental. Your feedback is highly appreciated!
            </Typography>
            <Button
                    variant="outlined"
                    startIcon={<Feedback />}
                    onClick={handleOpenFeedback}
                    sx={{
                      borderColor: '#ec4899',
                      alignContent: 'center',
                      justifyContent: 'center',
                      mt: 2,
                      color: '#ec4899',
                      '&:hover': { bgcolor: 'rgba(236,72,153,0.1)' },
                    }}
                  >
                    Give Feedback
                  </Button>
          </CardContent>
        </Card>
        
        

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

        {/* HOW IT WORKS */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>
            How It Works
          </Typography>
          <Grid container spacing={2}>
            {[
              { step: '1', text: 'Add songs you listen to' },
              { step: '2', text: 'Select movies you enjoy' },
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
      </Container>

      {/* AUTH DIALOG (unchanged logic) */}
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

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
            >
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
