import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ec4899", // Pink
      light: "#f472b6",
      dark: "#db2777",
    },
    secondary: {
      main: "#a855f7", // Purple
      light: "#c084fc",
      dark: "#9333ea",
    },
    background: {
      default: "#0f0f23",
      paper: "rgba(255, 255, 255, 0.05)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 900,
      fontSize: "3.5rem",
      background: "linear-gradient(45deg, #ec4899 30%, #a855f7 90%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    h2: {
      fontWeight: 800,
      fontSize: "2.5rem",
    },
    h3: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 24px",
          fontSize: "1rem",
        },
        contained: {
          background: "linear-gradient(45deg, #ec4899 30%, #a855f7 90%)",
          boxShadow: "0 8px 32px 0 rgba(236, 72, 153, 0.37)",
          "&:hover": {
            background: "linear-gradient(45deg, #db2777 30%, #9333ea 90%)",
            transform: "scale(1.02)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "rgba(255, 255, 255, 0.05)",
            "&:hover fieldset": {
              borderColor: "#ec4899",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#a855f7",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: "rgba(236, 72, 153, 0.2)",
          borderColor: "#ec4899",
        },
      },
    },
  },
});

export default theme;
