import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Box, Typography, Chip, Card, CardContent } from "@mui/material";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

// Professional marker icons
const createCustomIcon = (color: string, count?: number) =>
  new L.DivIcon({
    html: `
    <div style="
      background: ${color};
      width: ${count && count > 5 ? 32 : 24}px;
      height: ${count && count > 5 ? 32 : 24}px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: ${count && count > 5 ? 14 : 12}px;
      font-family: 'Inter', sans-serif;
    ">${count && count > 1 ? count : ""}</div>
  `,
    className: "custom-marker",
    iconSize: [count && count > 5 ? 32 : 24, count && count > 5 ? 32 : 24],
    iconAnchor: [count && count > 5 ? 16 : 12, count && count > 5 ? 16 : 12],
  });

// Area coordinates for Pune neighborhoods
const puneAreas: Record<string, { lat: number; lng: number; zoom?: number }> = {
  Kothrud: { lat: 18.5074, lng: 73.8077 },
  Baner: { lat: 18.5679, lng: 73.7797 },
  Aundh: { lat: 18.559, lng: 73.8077 },
  "Viman Nagar": { lat: 18.5679, lng: 73.9157 },
  "Koregaon Park": { lat: 18.5362, lng: 73.8958 },
  "Kalyani Nagar": { lat: 18.5482, lng: 73.9072 },
  Magarpatta: { lat: 18.515, lng: 73.928 },
  Hadapsar: { lat: 18.5089, lng: 73.926 },
  Wakad: { lat: 18.5975, lng: 73.7898 },
  Hinjawadi: { lat: 18.5912, lng: 73.7389 },
  Pimpri: { lat: 18.6298, lng: 73.8131 },
  Chinchwad: { lat: 18.6496, lng: 73.8062 },
  Kharadi: { lat: 18.5515, lng: 73.9471 },
  Pashan: { lat: 18.5362, lng: 73.7797 },
  "Shivaji Nagar": { lat: 18.533, lng: 73.855 },
  Camp: { lat: 18.5195, lng: 73.8553 },
};

interface MapViewProps {
  listings: any[];
  selectedArea?: string;
}

function MapController({ selectedArea }: { selectedArea?: string }) {
  const map = useMap();

  useEffect(() => {
    if (selectedArea && puneAreas[selectedArea]) {
      const { lat, lng } = puneAreas[selectedArea];
      map.setView([lat, lng], 13);
    }
  }, [selectedArea, map]);

  return null;
}

export default function MapView({ listings, selectedArea }: MapViewProps) {
  const puneCenter: [number, number] = [18.5204, 73.8567];
  const [areaStats, setAreaStats] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate listings count per area
    const stats: Record<string, number> = {};
    listings.forEach((listing) => {
      stats[listing.area] = (stats[listing.area] || 0) + 1;
    });
    setAreaStats(stats);
  }, [listings]);

  const getAreaColor = (area: string) => {
    const count = areaStats[area] || 0;
    if (count >= 5) return "#00ff88";
    if (count >= 3) return "#ffaa00";
    if (count >= 1) return "#ff6b35";
    return "#666";
  };

  return (
    <Box sx={{ position: "relative" }}>
      <MapContainer
        center={puneCenter}
        zoom={11}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid rgba(30, 64, 175, 0.2)",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapController selectedArea={selectedArea} />

        {/* Individual listing markers */}
        {listings.map((listing, index) => {
          const areaCoords = puneAreas[listing.area];
          if (!areaCoords) return null;

          // Add some random offset to avoid overlapping markers
          const lat = areaCoords.lat + (Math.random() - 0.5) * 0.01;
          const lng = areaCoords.lng + (Math.random() - 0.5) * 0.01;

          return (
            <Marker
              key={listing.id || index}
              position={[lat, lng]}
              icon={createCustomIcon("#1e40af", 1)}
              eventHandlers={{
                click: () => navigate(`/listing/${listing.id}`),
              }}
            >
              <Popup>
                <Card
                  sx={{
                    minWidth: 250,
                    background: "white",
                    color: "#1f2937",
                    border: "1px solid rgba(30, 64, 175, 0.2)",
                  }}
                >
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Typography variant="h6" sx={{ color: "#00d4ff", mb: 1 }}>
                      ₹{listing.rent?.toLocaleString()}/month
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      📍 {listing.area}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                      {listing.description?.substring(0, 100)}...
                    </Typography>
                    <Chip
                      label={listing.roomType || "Room"}
                      size="small"
                      sx={{
                        backgroundColor: "#ff6b35",
                        color: "white",
                      }}
                    />
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(30, 64, 175, 0.2)",
          borderRadius: 2,
          p: 2.5,
          minWidth: 220,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          zIndex: 1000,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: "#1e40af",
            mb: 1.5,
            fontWeight: 700,
            fontSize: "0.875rem",
          }}
        >
          🏠 Map Legend
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "#1e40af",
                border: "2px solid #ffffff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: "#374151" }}
            >
              Available Rooms
            </Typography>
          </Box>
          <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid #e5e7eb" }}>
            <Typography
              variant="caption"
              sx={{ color: "#6b7280", fontStyle: "italic" }}
            >
              Click markers for details
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
