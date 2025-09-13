import { Routes, Route, Link, Navigate } from "react-router-dom";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  ThemeProvider,
  createTheme,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  GlobalStyles,
} from "@mui/material";
import {
  Home as HomeIcon,
  Add as AddIcon,
  List as ListIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import PostRoomPage from "./pages/PostRoomPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyListingsPage from "./pages/MyListingsPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import ParticleAnimation from "./components/ParticleAnimation";
import { getToken, logout } from "./services/auth";

// Professional Background Component
const ProfessionalBackground = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.4'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          opacity: 0.1,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
          `,
        },
      }}
    />
  );
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1e40af",
      dark: "#1e3a8a",
      light: "#3b82f6",
    },
    secondary: {
      main: "#059669",
      dark: "#047857",
      light: "#10b981",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
    success: {
      main: "#10b981",
    },
    warning: {
      main: "#f59e0b",
    },
    error: {
      main: "#ef4444",
    },
  },
  typography: {
    fontFamily:
      '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.025em",
      fontSize: "3rem",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
      fontSize: "2.25rem",
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
      fontSize: "1.875rem",
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.015em",
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 24px",
          fontSize: "0.95rem",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease-in-out",
        },
        contained: {
          "&:hover": {
            boxShadow: "0 6px 16px rgba(30, 64, 175, 0.3)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.05)",
          "&:hover": {
            boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease-in-out",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          color: "#1f2937",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          position: "relative",
          zIndex: 1,
        },
      },
    },
  },
});

const globalStyles = (
  <GlobalStyles
    styles={{
      "*": {
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      },
      body: {
        fontFamily:
          '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
        backgroundColor: "#f8fafc",
        color: "#1f2937",
        lineHeight: 1.6,
        "-webkit-font-smoothing": "antialiased",
        "-moz-osx-font-smoothing": "grayscale",
      },
      ".scroll-smooth": {
        scrollBehavior: "smooth",
      },
      "@keyframes fadeInUp": {
        "0%": {
          opacity: 0,
          transform: "translateY(30px)",
        },
        "100%": {
          opacity: 1,
          transform: "translateY(0)",
        },
      },
      "@keyframes slideInRight": {
        "0%": {
          opacity: 0,
          transform: "translateX(30px)",
        },
        "100%": {
          opacity: 1,
          transform: "translateX(0)",
        },
      },
      ".animate-fade-in-up": {
        animation: "fadeInUp 0.6s ease-out forwards",
      },
      ".animate-slide-in-right": {
        animation: "slideInRight 0.6s ease-out forwards",
      },
      ".professional-shadow": {
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      ".professional-shadow-lg": {
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    }}
  />
);

function App() {
  const token = getToken();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    window.location.href = "/";
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <ProfessionalBackground />
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Typography
              variant="h4"
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "primary.main",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                fontSize: { xs: "1.5rem", md: "1.8rem" },
              }}
            >
              RoomLink
            </Typography>
            <Chip
              label="✓ Trusted Platform"
              size="small"
              sx={{
                ml: 3,
                backgroundColor: "#dcfce7",
                color: "#166534",
                fontWeight: 600,
                fontSize: "0.75rem",
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <Button
              color="inherit"
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
              sx={{
                color: "text.primary",
                fontWeight: 500,
                px: 2,
                "&:hover": {
                  backgroundColor: "rgba(30, 64, 175, 0.08)",
                },
              }}
            >
              Browse Rooms
            </Button>
            {token && (
              <Button
                component={Link}
                to="/post"
                startIcon={<AddIcon />}
                variant="contained"
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: 600,
                  px: 3,
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                List Property
              </Button>
            )}
            {token && (
              <Button
                color="inherit"
                component={Link}
                to="/my-listings"
                startIcon={<ListIcon />}
                sx={{
                  color: "text.primary",
                  fontWeight: 500,
                  px: 2,
                  "&:hover": {
                    backgroundColor: "rgba(30, 64, 175, 0.08)",
                  },
                }}
              >
                My Properties
              </Button>
            )}
          </Box>

          {!token ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{
                  color: "text.primary",
                  fontWeight: 500,
                  px: 3,
                  "&:hover": {
                    backgroundColor: "rgba(30, 64, 175, 0.08)",
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/register"
                startIcon={<PersonAddIcon />}
                sx={{
                  backgroundColor: "secondary.main",
                  color: "white",
                  fontWeight: 600,
                  px: 3,
                  "&:hover": {
                    backgroundColor: "secondary.dark",
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account menu"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                sx={{ color: "text.primary" }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleProfileMenuClose}
                onClick={handleProfileMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    borderRadius: 2,
                    minWidth: 180,
                  },
                }}
              >
                <MenuItem component={Link} to="/my-listings">
                  <ListIcon sx={{ mr: 1 }} />
                  My Listings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "transparent",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(248, 250, 252, 0.02)",
            backdropFilter: "blur(0.5px)",
            pointerEvents: "none",
          },
        }}
      >
        <Container
          maxWidth="xl"
          sx={{ py: { xs: 2, sm: 3, md: 4 }, position: "relative", zIndex: 1 }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listing/:id" element={<ListingDetailPage />} />
            <Route
              path="/post"
              element={token ? <PostRoomPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-listings"
              element={token ? <MyListingsPage /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
