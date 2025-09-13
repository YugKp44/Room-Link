import { useEffect, useState } from "react";
import api from "../services/apiService";
import MapView from "../components/MapView";
import RoomCard from "../components/RoomCard";
import {
  Box,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Button,
  Paper,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Grid,
  Container,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";

export default function HomePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    area: "",
    minRent: "",
    maxRent: "",
    roomType: "",
  });
  const [page, setPage] = useState(0);
  const [selectedArea, setSelectedArea] = useState<string>("");

  const puneAreas = [
    "Kothrud",
    "Baner",
    "Aundh",
    "Viman Nagar",
    "Koregaon Park",
    "Kalyani Nagar",
    "Magarpatta",
    "Hadapsar",
    "Wakad",
    "Hinjawadi",
    "Pimpri",
    "Chinchwad",
    "Kharadi",
    "Pashan",
    "Shivaji Nagar",
    "Camp",
  ];

  const fetchListings = () => {
    const params: any = {};
    if (filters.area) params.area = filters.area;
    if (filters.minRent) params.minRent = filters.minRent;
    if (filters.maxRent) params.maxRent = filters.maxRent;
    if (filters.roomType) params.roomType = filters.roomType;
    params.page = page;
    params.size = 20;
    api.get("/api/listings", { params }).then((res) => setListings(res.data));
  };

  useEffect(() => {
    fetchListings();
  }, [page]);

  const clearFilters = () => {
    setFilters({
      area: "",
      minRent: "",
      maxRent: "",
      roomType: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          mb: 6,
          py: { xs: 8, md: 12 },
          px: 4,
          textAlign: "center",
          background: "linear-gradient(135deg, #1e40af 0%, #059669 100%)",
          color: "white",
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Trust indicators */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            display: { xs: "none", md: "flex" },
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Chip
            label="🔒 Verified Properties"
            size="small"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: 600,
            }}
          />
          <Chip
            label="⭐ 10,000+ Happy Users"
            size="small"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: 600,
            }}
          />
        </Box>

        <Container maxWidth="md">
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: "2.5rem", md: "3.75rem" },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 3,
            }}
          >
            Find Trusted Rooms & Flatmates in Pune
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.95,
              maxWidth: 600,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.4,
              mb: 4,
            }}
          >
            Discover verified, comfortable rooms and trusted flatmates in Pune's
            most popular areas. Your safety and satisfaction are our priority.
          </Typography>

          {/* Trust Stats */}
          <Grid container spacing={3} sx={{ maxWidth: 600, mx: "auto" }}>
            <Grid item xs={4}>
              <Typography variant="h4" fontWeight="bold">
                2,500+
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Properties Listed
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h4" fontWeight="bold">
                98%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Satisfaction Rate
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h4" fontWeight="bold">
                24/7
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Support Available
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Search & Filters */}
      <Card
        sx={{
          mb: 6,
          borderRadius: 3,
          border: "1px solid rgba(30, 64, 175, 0.1)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <FilterIcon sx={{ mr: 2, color: "primary.main", fontSize: 28 }} />
            <Typography variant="h5" fontWeight="700" color="primary.main">
              Find Your Perfect Match
            </Typography>
            {hasActiveFilters && (
              <Chip
                label="Filters Applied"
                size="small"
                color="primary"
                sx={{ ml: 2, fontWeight: 600 }}
              />
            )}
            <Box sx={{ flexGrow: 1 }} />
            {hasActiveFilters && (
              <Button
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: "grey.300",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "rgba(30, 64, 175, 0.04)",
                  },
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                label="Area"
                value={filters.area}
                onChange={(e) => {
                  setFilters({ ...filters, area: e.target.value });
                  setSelectedArea(e.target.value);
                }}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">All Areas</MenuItem>
                {puneAreas.map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Min Rent"
                type="number"
                value={filters.minRent}
                onChange={(e) =>
                  setFilters({ ...filters, minRent: e.target.value })
                }
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Max Rent"
                type="number"
                value={filters.maxRent}
                onChange={(e) =>
                  setFilters({ ...filters, maxRent: e.target.value })
                }
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                label="Room Type"
                value={filters.roomType}
                onChange={(e) =>
                  setFilters({ ...filters, roomType: e.target.value })
                }
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="ROOM_1RK">1RK</MenuItem>
                <MenuItem value="ROOM_1BHK">1BHK</MenuItem>
                <MenuItem value="SHARED">Shared Room</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                onClick={fetchListings}
                fullWidth
                startIcon={<SearchIcon />}
                sx={{
                  height: 56,
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                  fontWeight: 600,
                }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Map View */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <MapView listings={listings} selectedArea={selectedArea} />
        </CardContent>
      </Card>

      {/* Results Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="600">
          Available Rooms
        </Typography>
        <Chip
          label={`${listings.length} found`}
          color="primary"
          variant="outlined"
          sx={{ ml: 2 }}
        />
      </Box>

      {/* Listings Grid */}
      {listings.length > 0 ? (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {listings.map((l) => (
            <Grid item xs={12} sm={6} lg={4} key={l.id}>
              <RoomCard listing={l} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card sx={{ textAlign: "center", py: 8, borderRadius: 3 }}>
          <CardContent>
            <HomeIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No rooms found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search filters to find more options
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {listings.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              sx={{ borderRadius: 2 }}
            >
              Previous
            </Button>
            <Chip
              label={`Page ${page + 1}`}
              variant="outlined"
              sx={{ px: 2, fontWeight: 600 }}
            />
            <Button
              variant="outlined"
              onClick={() => setPage((p) => p + 1)}
              disabled={listings.length < 20}
              sx={{ borderRadius: 2 }}
            >
              Next
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
