import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Chip,
  Divider,
  Grid,
  Avatar,
  Alert,
  Container,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  AccountBalance as AccountBalanceIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ZoomIn as ZoomInIcon,
} from "@mui/icons-material";
import api from "../services/apiService";

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/listings/${id}`);
      setListing(res.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to fetch listing details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (listing?.contactNumber) {
      window.open(`tel:${listing.contactNumber}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Room in ${listing.area}`,
        text: `Check out this room for ₹${listing.rent}/month`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Could add a snackbar here to show "Link copied"
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
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Listing not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ mr: 2, bgcolor: "grey.100" }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="bold" sx={{ flex: 1 }}>
          Room Details
        </Typography>
        <IconButton onClick={handleShare} sx={{ bgcolor: "grey.100", mr: 1 }}>
          <ShareIcon />
        </IconButton>
        <IconButton
          onClick={() => setIsFavorited(!isFavorited)}
          sx={{ bgcolor: "grey.100" }}
        >
          {isFavorited ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Image Section */}
          {listing.imageUrl && (
            <Card sx={{ mb: 3, borderRadius: 3, overflow: "hidden" }}>
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "60%",
                  cursor: "pointer",
                }}
                onClick={() => setImageDialogOpen(true)}
              >
                <img
                  src={`http://localhost:8080${listing.imageUrl}`}
                  alt="Room"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <ZoomInIcon fontSize="small" />
                  <Typography variant="body2">View Image</Typography>
                </Box>
              </Box>
            </Card>
          )}

          {/* Room Details */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              {/* Price and Area */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  ₹{listing.rent.toLocaleString()}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                  /month
                </Typography>
                <Chip
                  label={listing.roomType || "Room"}
                  color="primary"
                  variant="outlined"
                  sx={{ ml: 2 }}
                />
              </Box>

              {/* Location */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <LocationIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="600">
                  {listing.area}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {listing.description}
                </Typography>
              </Box>

              {/* Property Details */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Property Details
                </Typography>
                <Grid container spacing={2}>
                  {listing.deposit && (
                    <Grid item xs={6} sm={4}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Deposit
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            ₹{listing.deposit.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  <Grid item xs={6} sm={4}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <HomeIcon color="primary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Room Type
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {listing.roomType || "Standard Room"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CalendarIcon color="primary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Available From
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          Immediate
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              position: { md: "sticky" },
              top: { md: 24 },
              borderRadius: 3,
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Contact Owner
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Interested in this room?
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "grey.50",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                  }}
                >
                  <PhoneIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {listing.contactNumber}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleContact}
                  startIcon={<PhoneIcon />}
                  sx={{
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  Call Now
                </Button>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: "center", display: "block" }}
              >
                Please mention RoomLink when calling
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Image Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {listing.imageUrl && (
            <img
              src={`http://localhost:8080${listing.imageUrl}`}
              alt="Room"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
