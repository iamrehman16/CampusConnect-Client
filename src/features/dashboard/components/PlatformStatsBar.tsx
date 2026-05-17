import { Box, Card, Typography, Skeleton, Stack } from "@mui/material";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { usePublicStats } from "@/features/dashboard/hooks/dashboard.hooks";

// ─── Config ───────────────────────────────────────────────────────────────────

const STATS_CONFIG = [
  {
    key: "totalUsers" as const,
    label: "Students",
    icon: <PeopleOutlineIcon fontSize="small" />,
  },
  {
    key: "availableMentors" as const,
    label: "Mentors",
    icon: <SchoolOutlinedIcon fontSize="small" />,
  },
  {
    key: "totalResources" as const,
    label: "Resources",
    icon: <FolderOutlinedIcon fontSize="small" />,
  },
  {
    key: "postsThisMonth" as const,
    label: "Posts this month",
    icon: <ForumOutlinedIcon fontSize="small" />,
  },
];

// ─── Single stat cell ─────────────────────────────────────────────────────────

interface StatCellProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function StatCell({ icon, label, value }: StatCellProps) {
  return (
    <Stack alignItems="center" gap={0.5} sx={{ flex: 1 }}>
      <Box sx={{ color: "text.disabled", display: "flex" }}>{icon}</Box>
      <Typography variant="h6" fontWeight={700} lineHeight={1}>
        {value.toLocaleString()}
      </Typography>
      <Typography variant="caption" color="text.secondary" textAlign="center">
        {label}
      </Typography>
    </Stack>
  );
}

function StatCellSkeleton() {
  return (
    <Stack alignItems="center" gap={0.5} sx={{ flex: 1 }}>
      <Skeleton variant="circular" width={20} height={20} />
      <Skeleton width={48} height={28} />
      <Skeleton width={56} height={14} />
    </Stack>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PlatformStatsBar() {
  const { data: stats, isLoading, isError } = usePublicStats();

  if (isError) return null;

  return (
    <Card variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        textTransform="uppercase"
        letterSpacing={0.8}
        display="block"
        mb={2}
      >
        Platform at a glance
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          // dividers between cells
          "& > *:not(:last-child)": {
            borderRight: "1px solid",
            borderColor: "divider",
            pr: { xs: 1, sm: 2 },
          },
        }}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatCellSkeleton key={i} />
            ))
          : STATS_CONFIG.map(({ key, label, icon }) => (
              <StatCell
                key={key}
                icon={icon}
                label={label}
                value={stats?.[key] ?? 0}
              />
            ))}
      </Box>
    </Card>
  );
}
