import { Box, Card, Typography, InputBase, Stack } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";

export function AiAssistantCTA() {
  const navigate = useNavigate();

  const handleNavigate = () => navigate(ROUTES.AI_CHAT);

  return (
    <Card
      variant="outlined"
      onClick={handleNavigate}
      sx={{
        p: { xs: 2, sm: 2.5 },
        cursor: "pointer",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 0 0 1px",
          boxShadowColor: "primary.main",
        },
      }}
    >
      {/* ── Header ── */}
      <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
        <AutoAwesomeIcon
          sx={{ fontSize: 18, color: "primary.light" }}
        />
        <Typography variant="subtitle2" fontWeight={700} color="primary.light">
          CampusConnect AI
        </Typography>
      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={2}
        sx={{ maxWidth: 480 }}
      >
        Ask anything about your coursework, get study help, or search across
        all campus resources — powered by AI.
      </Typography>

      {/* ── Fake input bar ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "action.hover",
          transition: "border-color 0.15s ease",
          ".MuiCard-root:hover &": {
            borderColor: "primary.main",
          },
        }}
      >
        <InputBase
          placeholder="Ask AI anything about your coursework..."
          readOnly
          fullWidth
          sx={{
            fontSize: "0.875rem",
            color: "text.disabled",
            pointerEvents: "none",
            "& input": { cursor: "pointer" },
          }}
        />
        <ArrowForwardIcon
          sx={{ fontSize: 18, color: "primary.main", flexShrink: 0 }}
        />
      </Box>
    </Card>
  );
}