import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Divider,
  Chip,
  Button,
  Container,
  Paper,
  Stack,
} from "@mui/material";
import {
  Email as EmailIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import api from "../services/apiService";
import { logout } from "../services/auth";

interface UserInfo {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/user/me");
      setUser(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch user info");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "REPORTER":
        return "Property Owner";
      case "SEEKER":
        return "Room Seeker";
      case "ADMIN":
        return "Administrator";
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "REPORTER":
        return "primary";
      case "SEEKER":
        return "secondary";
      case "ADMIN":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Login Again
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!user) return null;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header with gradient background */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
            py: 4,
            px: 3,
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mx: "auto",
              mb: 2,
              bgcolor: "white",
              color: "primary.main",
              fontSize: "2.5rem",
              fontWeight: "bold",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            {user.email.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" fontWeight="bold" color="white">
            {user.email.split("@")[0]}
          </Typography>
          <Chip
            label={getRoleLabel(user.role)}
            color={getRoleColor(user.role) as any}
            size="small"
            sx={{
              mt: 1,
              fontWeight: 600,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
            }}
          />
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* User Details */}
          <Stack spacing={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.light", width: 44, height: 44 }}>
                <EmailIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email Address
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {user.email}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{ bgcolor: "secondary.light", width: 44, height: 44 }}
              >
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Account Type
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {getRoleLabel(user.role)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "success.light", width: 44, height: 44 }}>
                <CalendarIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatDate(user.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Quick Actions */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Quick Actions
          </Typography>
          <Stack spacing={2}>
            <Button
              component={RouterLink}
              to="/my-listings"
              variant="outlined"
              startIcon={<HomeIcon />}
              fullWidth
              sx={{ justifyContent: "flex-start", py: 1.5 }}
            >
              View My Listings
            </Button>
            <Button
              component={RouterLink}
              to="/post"
              variant="outlined"
              color="secondary"
              startIcon={<AddIcon />}
              fullWidth
              sx={{ justifyContent: "flex-start", py: 1.5 }}
            >
              Post New Property
            </Button>
            <Button
              onClick={handleLogout}
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              fullWidth
              sx={{ justifyContent: "flex-start", py: 1.5 }}
            >
              Logout
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
