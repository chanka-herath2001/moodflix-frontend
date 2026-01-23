import {
  AutoAwesome,
  Close,
  Favorite,
  Movie,
  MusicNote
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
      title: 'Add Your Jams',
      description: 'Manual entry, CSV import, or Last.fm integration',
    },
    {
      icon: <Favorite sx={{ fontSize: 48, color: '#ec4899' }} />,
      title: 'Pick Your Faves',
      description: 'Select movies you love to personalize recommendations',
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 48, color: '#a855f7' }} />,
      title: 'AI-Powered Magic',
      description: 'Get perfect movie matches based on your music taste',
    },
  ];

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    if (authTab === 0) {
      // Login
      const result = await login(formData.email, formData.password);
      if (result.success) {
        showSuccess(`Welcome back, ${result.user.name}! 👋`);
        setAuthDialog(false);
        navigate('/dashboard');
      } else {
        showError('Login failed. Please try again.');
      }
    } else {
      // Signup
      const result = await signup(formData.name, formData.email, formData.password);
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
    console.log('User already logged in, redirecting to dashboard:', user);
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 3 }}>
            <MusicNote sx={{ fontSize: 60, color: '#ec4899' }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '4.5rem' } }}>
              MoodFlix
            </Typography>
            <Movie sx={{ fontSize: 60, color: '#a855f7' }} />
          </Box>
          
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              mb: 4,
              fontWeight: 400,
            }}
          >
            Your music taste → Perfect movie vibes ✨
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => setAuthDialog(true)}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              borderRadius: 8,
            }}
          >
            Get Started 🚀
          </Button>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* How It Works */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ mb: 4, fontWeight: 800 }}>
            How It Works
          </Typography>
          <Grid container spacing={2}>
            {[
              { step: '1', text: 'Add your favorite songs' },
              { step: '2', text: 'Select movies you love' },
              { step: '3', text: 'Get AI-powered recommendations' },
            ].map((item) => (
              <Grid item xs={12} md={4} key={item.step}>
                <Box
                  sx={{
                    p: 3,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Typography variant="h4" sx={{ color: '#ec4899', mb: 2 }}>
                    {item.step}
                  </Typography>
                  <Typography variant="body1">{item.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Auth Dialog */}
      <Dialog
        open={authDialog}
        onClose={() => setAuthDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'rgba(30, 30, 60, 0.95)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {authTab === 0 ? 'Welcome Back' : 'Join MoodFlix'}
            </Typography>
            <Button onClick={() => setAuthDialog(false)} sx={{ minWidth: 'auto' }}>
              <Close />
            </Button>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Tabs
            value={authTab}
            onChange={(e, newValue) => setAuthTab(newValue)}
            sx={{ mb: 3 }}
            centered
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          <Box component="form" onSubmit={handleAuthSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {authTab === 1 && (
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
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
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              {authTab === 0 ? 'Login' : 'Sign Up'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Footer/>
    </Box>
  );
};

export default Landing;