import {
  Box,
  Card,
  Avatar,
  Typography,
  Chip,
  Skeleton,
  Stack,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useMyProfile } from "@/features/user/hooks/profile-hooks";
import { useMyStats } from "@/features/dashboard/hooks/dashboard.hooks";
import { UserRole } from "@/shared/types/enums";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatMemberSince(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function getRoleLabel(role: UserRole): string {
  const map: Record<UserRole, string> = {
    [UserRole.STUDENT]: "Student",
    [UserRole.CONTRIBUTOR]: "Contributor",
    [UserRole.ADMIN]: "Admin",
  };
  return map[role] ?? role;
}

// ─── Stat block ───────────────────────────────────────────────────────────────

interface StatBlockProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function StatBlock({ icon, label, value }: StatBlockProps) {
  return (
    <Box
      sx={{
        bgcolor: "action.hover",
        borderRadius: 2,
        px: 1.5,
        py: 1.25,
      }}
    >
      <Stack direction="row" alignItems="center" gap={0.5} mb={0.5}>
        <Box sx={{ color: "text.secondary", display: "flex", fontSize: 14 }}>
          {icon}
        </Box>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="h6" fontWeight={700} lineHeight={1}>
        {value.toLocaleString()}
      </Typography>
    </Box>
  );
}

function StatBlockSkeleton() {
  return (
    <Box sx={{ bgcolor: "action.hover", borderRadius: 2, px: 1.5, py: 1.25 }}>
      <Skeleton width={60} height={14} sx={{ mb: 0.5 }} />
      <Skeleton width={40} height={28} />
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GreetingStatsCard() {
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: stats, isLoading: statsLoading } = useMyStats();

  const isLoading = profileLoading || statsLoading;

  return (
    <Card variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
      {/* ── Header row ── */}
      <Stack direction="row" alignItems="center" gap={1.5} mb={2.5}>
        {profileLoading ? (
          <Skeleton variant="circular" width={48} height={48} />
        ) : (
          <Avatar
            src={profile?.avatar}
            sx={{
              width: 48,
              height: 48,
              bgcolor: "primary.dark",
              fontSize: "1rem",
              fontWeight: 700,
            }}
          >
            {profile?.name ? getInitials(profile.name) : "?"}
          </Avatar>
        )}

        <Box>
          {profileLoading ? (
            <>
              <Skeleton width={200} height={24} />
              <Skeleton width={140} height={18} sx={{ mt: 0.5 }} />
            </>
          ) : (
            <>
              <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                {getGreeting()}, {profile?.name?.split(" ")[0]}
              </Typography>
              <Stack direction="row" alignItems="center" gap={1} mt={0.75}>
                {profile?.createdAt && (
                  <Typography variant="caption" color="text.secondary">
                    Member since {formatMemberSince(profile.createdAt)}
                  </Typography>
                )}
                {profile?.role && (
                  <Chip
                    label={getRoleLabel(profile.role)}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      bgcolor: "primary.dark",
                      color: "primary.light",
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                )}
              </Stack>
            </>
          )}
        </Box>
      </Stack>

      {/* ── Stat blocks ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(4, 1fr)",
          },
          gap: 1.5,
        }}
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatBlockSkeleton key={i} />)
        ) : (
          <>
            <StatBlock
              icon={<EditNoteIcon fontSize="inherit" />}
              label="Posts"
              value={stats?.postCount ?? 0}
            />
            <StatBlock
              icon={<InsertDriveFileOutlinedIcon fontSize="inherit" />}
              label="Resources"
              value={stats?.resourceCount ?? 0}
            />
            <StatBlock
              icon={<ArrowUpwardIcon fontSize="inherit" />}
              label="Upvotes"
              value={stats?.totalUpvotesReceived ?? 0}
            />
            <StatBlock
              icon={<FileDownloadOutlinedIcon fontSize="inherit" />}
              label="Downloads"
              value={stats?.totalDownloads ?? 0}
            />
          </>
        )}
      </Box>
    </Card>
  );
}
