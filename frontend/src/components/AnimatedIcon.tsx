import { Box, keyframes } from "@mui/material";
import { ReactNode } from "react";

interface AnimatedIconProps {
  children: ReactNode;
  animation?: "float" | "rotate" | "pulse" | "bounce" | "swing";
  duration?: number;
  delay?: number;
}

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(5deg); }
  50% { transform: translateY(-15px) rotate(0deg); }
  75% { transform: translateY(-5px) rotate(-5deg); }
`;

const rotateAnimation = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.1); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
`;

const bounceAnimation = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
  40%, 43% { transform: translate3d(0, -30px, 0) rotate(10deg); }
  70% { transform: translate3d(0, -15px, 0) rotate(-5deg); }
  90% { transform: translate3d(0, -4px, 0) rotate(2deg); }
`;

const swingAnimation = keyframes`
  20% { transform: rotate3d(0, 0, 1, 15deg); }
  40% { transform: rotate3d(0, 0, 1, -10deg); }
  60% { transform: rotate3d(0, 0, 1, 5deg); }
  80% { transform: rotate3d(0, 0, 1, -5deg); }
  100% { transform: rotate3d(0, 0, 1, 0deg); }
`;

const getAnimation = (type: string) => {
  switch (type) {
    case "float":
      return floatAnimation;
    case "rotate":
      return rotateAnimation;
    case "pulse":
      return pulseAnimation;
    case "bounce":
      return bounceAnimation;
    case "swing":
      return swingAnimation;
    default:
      return floatAnimation;
  }
};

export default function AnimatedIcon({
  children,
  animation = "float",
  duration = 3,
  delay = 0,
}: AnimatedIconProps) {
  return (
    <Box
      sx={{
        animation: `${getAnimation(
          animation
        )} ${duration}s ease-in-out ${delay}s infinite`,
        transformOrigin: "center center",
        "&:hover": {
          animationPlayState: "paused",
          transform: "scale(1.1)",
          transition: "transform 0.3s ease",
        },
      }}
    >
      {children}
    </Box>
  );
}
