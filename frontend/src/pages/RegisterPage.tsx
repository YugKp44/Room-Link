import { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
  MenuItem,
  Card,
  CardContent,
  Box,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  Alert,
  Chip,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon,
  Home as HomeIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import AnimatedIcon from "../components/AnimatedIcon";
import { register } from "../services/auth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"REPORTER" | "SEEKER">("REPORTER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(email, password, role);
      window.location.href = "/";
    } catch (e: any) {
      setError(e?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{ maxWidth: 450, width: "100%", borderRadius: 3, boxShadow: 3 }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <AnimatedIcon animation="bounce" duration={2.5}>
              <PersonAddIcon
                sx={{
                  fontSize: 48,
                  mb: 2,
                  p: 1,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(124, 58, 237, 0.3)",
                }}
              />
            </AnimatedIcon>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Join RoomLink
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your account to start finding or listing rooms
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={onSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                variant="outlined"
                helperText="Minimum 6 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  I want to:
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Chip
                    icon={<HomeIcon />}
                    label="List my room"
                    onClick={() => setRole("REPORTER")}
                    variant={role === "REPORTER" ? "filled" : "outlined"}
                    color={role === "REPORTER" ? "primary" : "default"}
                    sx={{ flex: 1, py: 1, fontWeight: 600 }}
                  />
                  <Chip
                    icon={<SearchIcon />}
                    label="Find a room"
                    onClick={() => setRole("SEEKER")}
                    variant={role === "SEEKER" ? "filled" : "outlined"}
                    color={role === "SEEKER" ? "secondary" : "default"}
                    sx={{ flex: 1, py: 1, fontWeight: 600 }}
                  />
                </Stack>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                  borderRadius: 2,
                }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Divider>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
