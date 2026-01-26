import { Login, Logout, Movie, MusicNote } from '@mui/icons-material';
import { AppBar, Avatar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const Navbar = ({ onLoginClick }) => {
  const { user, logout } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      showSuccess('Logged out successfully! 👋');
      navigate('/');
    }
  };

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate('/');
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: 'rgba(30, 30, 60, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexGrow: 1,
            cursor: 'pointer',
          }}
          onClick={() => navigate(user ? '/dashboard' : '/')}
        >
          <MusicNote sx={{ color: '#ec4899' }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              background: 'linear-gradient(45deg, #ec4899 30%, #a855f7 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            MoodFlix
          </Typography>
          <Movie sx={{ color: '#a855f7' }} />
        </Box>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: '#ec4899',
                fontSize: '0.9rem',
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user.name}
            </Typography>
            <Button
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(236, 72, 153, 0.1)',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Button
            startIcon={<Login />}
            onClick={handleLogin}
            sx={{
              color: 'white',
              '&:hover': {
                background: 'rgba(236, 72, 153, 0.1)',
              },
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;