// features/user/components/ProfileHeader.tsx
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/EditOutlined";
import SchoolIcon from "@mui/icons-material/SchoolOutlined";
import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";
import type { User } from "@/shared/types/auth.types";
import { UserRole, UserStatus } from "@/shared/types/enums";
import { useLogout } from "@/features/auth/hooks/useLogout";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileHeaderProps {
  user: User;
  isOwner: boolean;
  resourceCount: number;
  postCount: number;
  onEditClick?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name?: string, email?: string): string => {
  if (name?.trim()) {
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  }
  return email?.[0]?.toUpperCase() ?? "?";
};

const getRoleBadge = (role: UserRole) => {
  const map: Record<UserRole, { label: string; color: string; bg: string }> = {
    [UserRole.ADMIN]: {
      label: "Admin",
      color: "#ffd166",
      bg: "rgba(255,209,102,0.12)",
    },
    [UserRole.CONTRIBUTOR]: {
      label: "Contributor",
      color: "#00D9A6",
      bg: "rgba(0,217,166,0.12)",
    },
    [UserRole.STUDENT]: {
      label: "Student",
      color: "#6C63FF",
      bg: "rgba(108,99,255,0.12)",
    },
  };
  return map[role] ?? map[UserRole.STUDENT];
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

// ─── Stat Item ────────────────────────────────────────────────────────────────

const StatItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <Box sx={{ textAlign: "center", px: 2 }}>
    <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1 }}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const ProfileHeader = ({
  user,
  isOwner,
  resourceCount,
  postCount,
  onEditClick,
}: ProfileHeaderProps) => {
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const initials = getInitials(user.name, user.email);
  const roleBadge = getRoleBadge(user.role);
  const isBanned = user.accountStatus !== UserStatus.ACTIVE;

  const expertiseTags =
    user.expertise
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) ?? [];

  return (
    <Box
      sx={{
        p: { xs: 2.5, sm: 4 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        background: (t) =>
          `linear-gradient(135deg, ${t.palette.background.paper} 0%, rgba(108,99,255,0.04) 100%)`,
      }}
    >
      {/* ── Top row: avatar + info + actions ── */}
      <Stack direction="row" spacing={2.5} alignItems="flex-start">
        {/* Initials avatar */}
        <Avatar
          sx={{
            width: { xs: 64, sm: 80 },
            height: { xs: 64, sm: 80 },
            fontSize: { xs: "1.4rem", sm: "1.8rem" },
            fontWeight: 600,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            flexShrink: 0,
          }}
        >
          {initials}
        </Avatar>

        {/* Name / badges / meta */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, wordBreak: "break-word" }}
            >
              {user.name ?? user.email}
            </Typography>

            {/* Role badge */}
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 1,
                fontSize: "0.7rem",
                fontWeight: 600,
                color: roleBadge.color,
                bgcolor: roleBadge.bg,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              {roleBadge.label}
            </Box>

            {/* Account status badge — only shown if not active */}
            {isBanned && (
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "error.main",
                  bgcolor: "rgba(211,47,47,0.1)",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                {user.accountStatus}
              </Box>
            )}
          </Stack>

          {/* Academic info */}
          {user.academicInfo && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ mt: 0.75 }}
            >
              <SchoolIcon sx={{ fontSize: 15, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {user.academicInfo}
              </Typography>
            </Stack>
          )}

          {/* Semester + joined date */}
          <Stack direction="row" spacing={2} sx={{ mt: 0.5 }} flexWrap="wrap">
            {user.semester && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <SchoolIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                <Typography variant="caption" color="text.disabled">
                  Semester {user.semester}
                </Typography>
              </Stack>
            )}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <CalendarIcon sx={{ fontSize: 14, color: "text.disabled" }} />
              <Typography variant="caption" color="text.disabled">
                Joined {formatDate(user.createdAt)}
              </Typography>
            </Stack>
          </Stack>

          {/* Expertise chips */}
          {expertiseTags.length > 0 && (
            <Stack
              direction="row"
              spacing={0.75}
              sx={{ mt: 1.25 }}
              flexWrap="wrap"
            >
              {expertiseTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.7rem",
                    bgcolor: "rgba(108,99,255,0.1)",
                    color: "primary.light",
                    border: "1px solid rgba(108,99,255,0.2)",
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* ── Owner actions (top-right) ── */}
        {isOwner && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ flexShrink: 0 }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={onEditClick}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Edit Profile
            </Button>
            <Tooltip title="Logout">
              <IconButton
                size="small"
                onClick={() => logout()}
                disabled={loggingOut}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "error.main" },
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Stack>

      {/* ── Stats strip ── */}
      <Stack
        direction="row"
        sx={{
          mt: 3,
          pt: 2.5,
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: { xs: "space-around", sm: "flex-start" },
          gap: { sm: 1 },
        }}
        divider={<Box sx={{ width: "1px", bgcolor: "divider", mx: 1 }} />}
      >
        <StatItem label="Resources" value={resourceCount} />
        <StatItem label="Posts" value={postCount} />
        <StatItem label="Contribution Score" value={user.contributionScore} />
      </Stack>
    </Box>
  );
};
