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
  CardMedia,
  Box,
  Grid,
  InputAdornment,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import api from "../services/apiService";

const roomTypes = [
  { value: "ROOM_1RK", label: "1RK" },
  { value: "ROOM_1BHK", label: "1BHK" },
  { value: "SHARED", label: "Shared Room" },
];

export default function PostRoomPage() {
  const [form, setForm] = useState({
    area: "",
    rent: "",
    deposit: "",
    roomType: "ROOM_1RK",
    description: "",
    contactNumber: "",
    latitude: "",
    longitude: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const newFiles = [...files];
      const newPreviews = [...imagePreviews];

      selectedFiles.forEach((file) => {
        newFiles.push(file);
        const reader = new FileReader();
        reader.onload = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === newFiles.length) {
            setFiles(newFiles);
            setImagePreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const uploadImages = async (): Promise<string[]> => {
    if (files.length === 0) return [];

    const uploadPromises = files.map(async (file) => {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/api/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.url;
    });

    return Promise.all(uploadPromises);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const imageUrls = await uploadImages();
      await api.post("/api/listings", {
        ...form,
        rent: Number(form.rent),
        deposit: Number(form.deposit),
        latitude: form.latitude ? Number(form.latitude) : undefined,
        longitude: form.longitude ? Number(form.longitude) : undefined,
        imageUrl: imageUrls[0] || "", // Primary image for backward compatibility
        imageUrls, // All images for multiple image support
      });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/my-listings";
      }, 2000);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card sx={{ maxWidth: 600, mx: "auto", textAlign: "center", p: 4 }}>
        <CardContent>
          <CheckIcon sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom color="success.main">
            Room Listed Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Redirecting to your listings...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6, py: 4 }}>
        <Typography
          variant="h2"
          fontWeight="800"
          gutterBottom
          color="primary.main"
        >
          List Your Property
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Join thousands of trusted property owners and help someone find their
          perfect home in Pune
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
          <Chip
            label="✓ Free to List"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label="✓ Verified Tenants"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label="✓ Quick Process"
            color="secondary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Box>

      {/* Form */}
      <Card sx={{ maxWidth: 800, mx: "auto", borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {loading && <LinearProgress sx={{ mb: 3, borderRadius: 1 }} />}

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={onSubmit}>
            <Stack spacing={4}>
              {/* Basic Information */}
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <HomeIcon sx={{ mr: 1, color: "primary.main" }} />
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Area/Locality"
                      name="area"
                      value={form.area}
                      onChange={handleChange}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    >
                      {puneAreas.map((area) => (
                        <MenuItem key={area} value={area}>
                          {area}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Room Type"
                      name="roomType"
                      value={form.roomType}
                      onChange={handleChange}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    >
                      {roomTypes.map((rt) => (
                        <MenuItem key={rt.value} value={rt.value}>
                          {rt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>

              {/* Pricing */}
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <MoneyIcon sx={{ mr: 1, color: "primary.main" }} />
                  Pricing Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Monthly Rent"
                      name="rent"
                      type="number"
                      value={form.rent}
                      onChange={handleChange}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Security Deposit"
                      name="deposit"
                      type="number"
                      value={form.deposit}
                      onChange={handleChange}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Description & Contact */}
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <DescriptionIcon sx={{ mr: 1, color: "primary.main" }} />
                  Description & Contact
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  <TextField
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your room, amenities, nearby facilities, etc."
                    fullWidth
                  />

                  <TextField
                    label="Contact Number"
                    name="contactNumber"
                    value={form.contactNumber}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Box>

              {/* Location (Optional) */}
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <LocationIcon sx={{ mr: 1, color: "primary.main" }} />
                  Location (Optional)
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Latitude"
                      name="latitude"
                      value={form.latitude}
                      onChange={handleChange}
                      fullWidth
                      helperText="For better map visibility"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Longitude"
                      name="longitude"
                      value={form.longitude}
                      onChange={handleChange}
                      fullWidth
                      helperText="For better map visibility"
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Image Upload */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <UploadIcon
                    sx={{ mr: 2, color: "primary.main", fontSize: 28 }}
                  />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    Room Photos
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, ml: 5 }}
                >
                  Add high-quality photos to attract more potential tenants
                </Typography>

                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    border: "2px dashed",
                    borderColor:
                      imagePreviews.length > 0 ? "success.main" : "grey.300",
                    borderRadius: 3,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 150,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: "primary.main",
                      backgroundColor: "rgba(30, 64, 175, 0.02)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <UploadIcon
                      sx={{
                        fontSize: 48,
                        color: "primary.main",
                        mb: 1,
                        opacity: 0.7,
                      }}
                    />
                    <Typography
                      variant="h6"
                      color="text.primary"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {imagePreviews.length > 0
                        ? "Add More Photos"
                        : "Upload Room Photos"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", maxWidth: 280 }}
                    >
                      Click to browse or drag and drop multiple images
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, opacity: 0.7 }}
                    >
                      {imagePreviews.length > 0 &&
                        `${imagePreviews.length} photo(s) selected • `}
                      Supports JPG, PNG files
                    </Typography>
                  </Box>
                </Paper>

                {/* Image Previews Grid */}
                {imagePreviews.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="h6"
                      color="text.primary"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      Selected Photos ({imagePreviews.length})
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: 2,
                      }}
                    >
                      {imagePreviews.map((preview, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: "relative",
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          <img
                            src={preview}
                            alt={`Room preview ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              display: "flex",
                              gap: 1,
                            }}
                          >
                            {index === 0 && (
                              <Chip
                                label="Primary"
                                size="small"
                                sx={{
                                  backgroundColor: "primary.main",
                                  color: "white",
                                  fontSize: "0.7rem",
                                }}
                              />
                            )}
                            <IconButton
                              onClick={() => removeImage(index)}
                              size="small"
                              sx={{
                                backgroundColor: "rgba(255,255,255,0.9)",
                                color: "error.main",
                                "&:hover": {
                                  backgroundColor: "white",
                                  transform: "scale(1.1)",
                                },
                                width: 28,
                                height: 28,
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Submit Button */}
              <Box sx={{ pt: 2 }}>
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
                      "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                    borderRadius: 2,
                  }}
                >
                  {loading ? "Publishing Your Room..." : "Publish Room Listing"}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
