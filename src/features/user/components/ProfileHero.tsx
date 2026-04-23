import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CalendarToday,
  School,
  CheckCircle,
  HourglassEmpty,
  Cancel,
  Article,
} from "@mui/icons-material";
import { UserRole } from "@/shared/types/enums";
import type {
  ProfileStats,
  ProfileUserViewModel,
} from "../types/profile.types";

interface ProfileHeroProps {
  user: ProfileUserViewModel | null;
  stats?: ProfileStats;
  isLoading?: boolean;
  /** Slot for action buttons (Edit button on private, nothing on public) */
  actions?: React.ReactNode;
}

const StatBox = ({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 0.5,
      px: { xs: 1.25, sm: 2 },
      py: { xs: 1, sm: 1.5 },
      borderRadius: 2,
      bgcolor: "action.hover",
      border: "1px solid",
      borderColor: "divider",
      minWidth: { xs: 68, sm: 80 },
    }}
  >
    <Box sx={{ color, display: "flex", alignItems: "center" }}>{icon}</Box>
    <Typography
      variant="h6"
      fontWeight={700}
      sx={{ color: "text.primary", lineHeight: 1 }}
    >
      {value}
    </Typography>
    <Typography
      variant="caption"
      sx={{ color: "text.secondary", fontSize: "0.65rem", textAlign: "center" }}
    >
      {label}
    </Typography>
  </Box>
);

const ProfileHero: React.FC<ProfileHeroProps> = ({
  user,
  stats,
  isLoading,
  actions,
}) => {
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Card
      sx={{
        borderRadius: { xs: 0, sm: 3 },
        mb: 0,
        bgcolor: "background.paper",
        border: { xs: 0, sm: "1px solid" },
        borderColor: { sm: "divider" },
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Top row: avatar + info + actions */}
        <Stack
          direction="row"
          spacing={{ xs: 1.5, sm: 2 }}
          alignItems="flex-start"
        >
          {isLoading ? (
            <Skeleton variant="circular" width={64} height={64} />
          ) : (
            <Avatar
              alt={user?.name}
              sx={{
                width: { xs: 56, sm: 72 },
                height: { xs: 56, sm: 72 },
                fontSize: { xs: "1.35rem", sm: "1.75rem" },
                fontWeight: 700,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                flexShrink: 0,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          )}

          {/* Name / meta */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            {isLoading ? (
              <>
                <Skeleton width={160} height={28} sx={{ mb: 0.5 }} />
                <Skeleton width={180} height={18} />
              </>
            ) : (
              <>
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  spacing={1}
                  sx={{ width: "100%" }}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.75}
                      flexWrap="wrap"
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ lineHeight: 1.2 }}
                      >
                        {user?.name}
                      </Typography>
                      {user?.role === UserRole.ADMIN && (
                        <Chip
                          label="Admin"
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ height: 20, fontSize: "0.65rem", fontWeight: 600 }}
                        />
                      )}
                    </Stack>
                    {joinDate && (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={{ mt: 0.5 }}
                      >
                        <CalendarToday sx={{ fontSize: 12, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          Joined {joinDate}
                        </Typography>
                      </Stack>
                    )}
                  </Box>

                  {actions && (
                    <Box sx={{ flexShrink: 0, ml: 1 }}>
                      {actions}
                    </Box>
                  )}
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mt: 0.75 }}
                >
                  {(user?.academicInfo || user?.semester) && (
                    <Chip
                      icon={<School sx={{ fontSize: 14 }} />}
                      label={`${user?.academicInfo ?? "Academic info not set"}${
                        user?.semester ? ` · Sem ${user.semester}` : ""
                      }`}
                      size="small"
                      variant="outlined"
                      sx={{ maxWidth: "100%" }}
                    />
                  )}
                </Stack>

                {user?.expertise && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      lineHeight: 1.5,
                      fontSize: "0.82rem",
                      display: "-webkit-box",
                      WebkitLineClamp: { xs: 2, sm: 3 },
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {user.expertise}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          justifyContent={{ xs: "space-between", sm: "flex-start" }}
        >
          {isLoading ? (
            [0, 1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" width={76} height={64} />
            ))
          ) : (
            <>
              <Tooltip title="Total posts" arrow>
                <span>
                  <StatBox
                    icon={<Article sx={{ fontSize: 16 }} />}
                    value={stats?.totalPosts ?? 0}
                    label="Posts"
                    color="primary.main"
                  />
                </span>
              </Tooltip>
              <Tooltip title="Approved resources" arrow>
                <span>
                  <StatBox
                    icon={<CheckCircle sx={{ fontSize: 16 }} />}
                    value={stats?.approvedResources ?? 0}
                    label="Approved"
                    color="success.main"
                  />
                </span>
              </Tooltip>
              <Tooltip title="Pending review" arrow>
                <span>
                  <StatBox
                    icon={<HourglassEmpty sx={{ fontSize: 16 }} />}
                    value={stats?.pendingResources ?? 0}
                    label="Pending"
                    color="warning.main"
                  />
                </span>
              </Tooltip>
              <Tooltip title="Rejected resources" arrow>
                <span>
                  <StatBox
                    icon={<Cancel sx={{ fontSize: 16 }} />}
                    value={stats?.rejectedResources ?? 0}
                    label="Rejected"
                    color="error.main"
                  />
                </span>
              </Tooltip>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileHero;
