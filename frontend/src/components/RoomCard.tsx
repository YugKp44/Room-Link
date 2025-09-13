import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  AccountBalanceWallet as WalletIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const getRoomTypeLabel = (roomType: string) => {
  switch (roomType) {
    case "ROOM_1RK":
      return "1RK";
    case "ROOM_1BHK":
      return "1BHK";
    case "SHARED":
      return "Shared Room";
    default:
      return roomType;
  }
};

const getRoomTypeColor = (roomType: string) => {
  switch (roomType) {
    case "ROOM_1RK":
      return "primary";
    case "ROOM_1BHK":
      return "secondary";
    case "SHARED":
      return "success";
    default:
      return "default";
  }
};

export default function RoomCard({ listing }: { listing: any }) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        background: "white",
        border: "1px solid rgba(0,0,0,0.08)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          "& .room-image": {
            transform: "scale(1.05)",
          },
          "& .price-highlight": {
            backgroundColor: "primary.main",
            color: "white",
          },
        },
        borderRadius: 3,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={() => navigate(`/listing/${listing.id}`)}
    >
      {/* Image Section */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        {listing.imageUrl ? (
          <CardMedia
            component="img"
            height="220"
            image={`http://localhost:8080${listing.imageUrl}`}
            alt={`Room in ${listing.area}`}
            className="room-image"
            sx={{
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          />
        ) : (
          <Box
            className="room-image"
            sx={{
              height: 220,
              background:
                "linear-gradient(135deg, rgba(227, 242, 253, 0.8) 0%, rgba(243, 229, 245, 0.8) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              backdropFilter: "blur(10px)",
            }}
          >
            <HomeIcon sx={{ fontSize: 60, color: "text.secondary" }} />
          </Box>
        )}

        {/* Overlay Actions */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // Add favorite functionality
            }}
            sx={{
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                backgroundColor: "white",
                color: "error.main",
              },
            }}
          >
            <FavoriteIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // Add share functionality
            }}
            sx={{
              backgroundColor: "rgba(255,255,255,0.9)",
              "&:hover": { backgroundColor: "white" },
            }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Room Type Badge */}
        <Chip
          label={getRoomTypeLabel(listing.roomType)}
          color={getRoomTypeColor(listing.roomType) as any}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Content Section */}
      <CardContent
        sx={{
          p: 3,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Price and Location */}
        <Box sx={{ mb: 2 }}>
          <Box
            className="price-highlight"
            sx={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 2,
              backgroundColor: "rgba(30, 64, 175, 0.08)",
              border: "1px solid rgba(30, 64, 175, 0.2)",
              mb: 2,
              transition: "all 0.3s ease",
            }}
          >
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              ₹{listing.rent?.toLocaleString()}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ ml: 1, fontWeight: 500 }}
              >
                /month
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationIcon
              sx={{ fontSize: 18, color: "text.secondary", mr: 0.5 }}
            />
            <Typography variant="body1" fontWeight="600" color="text.primary">
              {listing.area}
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.5,
          }}
        >
          {listing.description || "No description available"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Footer Info */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{ width: 32, height: 32, bgcolor: "primary.light", mr: 1 }}
            >
              <PhoneIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Contact
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {listing.contactNumber}
              </Typography>
            </Box>
          </Box>

          {listing.deposit && (
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary">
                Deposit
              </Typography>
              <Typography variant="body2" fontWeight="600" color="primary.main">
                ₹{listing.deposit?.toLocaleString()}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
