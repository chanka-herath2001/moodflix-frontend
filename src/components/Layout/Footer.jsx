import { Movie, MusicNote } from '@mui/icons-material';
import { Box, Divider, Link, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 3,
        px: 2,
        background: 'rgba(30, 30, 60, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
      }}
    >
      {/* Logo / Branding */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          mb: 1,
        }}
      >
        <MusicNote sx={{ color: '#ec4899', fontSize: 18 }} />
        <Typography
          sx={{
            fontWeight: 900,
            background: 'linear-gradient(45deg, #ec4899 30%, #a855f7 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          MoodFlix
        </Typography>
        <Movie sx={{ color: '#a855f7', fontSize: 18 }} />
      </Box>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}
      >
        Built by <strong>Chanka Herath</strong> · A music-powered movie recommendation project
      </Typography>

      <Divider
        sx={{
          my: 2,
          mx: 'auto',
          width: '60%',
          borderColor: 'rgba(255,255,255,0.1)',
        }}
      />

      {/* Contact */}
      <Typography
        variant="caption"
        sx={{ color: 'rgba(255,255,255,0.6)' }}
      >
        Want to share feedback or collaborate?
      </Typography>

      <Box sx={{ mt: 1 }}>
        <Link
          href="mailto:chankaherath2001@gmail.com"
          underline="none"
          sx={{
            mx: 1,
            color: '#ec4899',
            fontSize: '0.85rem',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Email
        </Link>

        <Link
          href="https://github.com/chanka-herath2001"
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{
            mx: 1,
            color: '#a855f7',
            fontSize: '0.85rem',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          GitHub
        </Link>

        <Link
          href="https://www.linkedin.com/in/chanka-herath/"
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{
            mx: 1,
            color: '#60a5fa',
            fontSize: '0.85rem',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          LinkedIn
        </Link>
        <Link
          href="https://portfolio-cdh.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{
            mx: 1,
            color: '#36c342',
            fontSize: '0.85rem',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Portfolio
        </Link>
      </Box>

      {/* Copyright */}
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mt: 2,
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        © {new Date().getFullYear()} MoodFlix · Built by Chanka Herath
      </Typography>
    </Box>
  );
};

export default Footer;
