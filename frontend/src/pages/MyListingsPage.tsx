import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Chip,
  Avatar,
  Fab,
  Alert,
  Container,
} from "@mui/material";
import {
  Add as AddIcon,
  Home as HomeIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import api from "../services/apiService";
import RoomCard from "../components/RoomCard";

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/listings/my-listings");
      setListings(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch listings");
    } finally {
      setLoading(false);
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

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 48,
                height: 48,
              }}
            >
              <HomeIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                My Listings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your room listings
              </Typography>
            </Box>
          </Box>

          <Button
            component={RouterLink}
            to="/post"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
            }}
          >
            Add New Listing
          </Button>
        </Box>

        {/* Stats Card */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            border: "1px solid",
            borderColor: "grey.200",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {listings.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Listings
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {listings.filter((l) => l.status === "ACTIVE").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold" color="warning.main">
                  {listings.filter((l) => l.status === "PENDING").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <Card
          sx={{
            textAlign: "center",
            py: 8,
            borderRadius: 3,
            border: "2px dashed",
            borderColor: "grey.300",
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
          }}
        >
          <HomeIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
          <Typography
            variant="h5"
            fontWeight="bold"
            color="text.secondary"
            gutterBottom
          >
            No listings yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start by creating your first room listing
          </Typography>
          <Button
            component={RouterLink}
            to="/post"
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            Create First Listing
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <Grid item xs={12} sm={6} lg={4} key={listing.id}>
              <RoomCard listing={listing} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button */}
      <Fab
        component={RouterLink}
        to="/post"
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}
