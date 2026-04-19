// features/admin/components/AnalyticsSection.tsx
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import ChartCard from "./ChartCard";
import UploadsLineChart from "./UploadsLineChart";
import UserGrowthChart from "./UserGrowthChart";
import ApprovalDonut from "./ApprovalDonut";
import FileTypeBarChart from "./FileTypeBarChart";
import SubjectBarChart from "./SubjectBarChart";
import TopContributorsTable from "./TopContributorsTable";
import { useResourceAnalytics, useUserGrowth } from "../hooks/admin-hooks";

export default function AnalyticsSection() {
  const resources = useResourceAnalytics();
  const growth = useUserGrowth();

  const isLoading = resources.isLoading || growth.isLoading;

  if (resources.isError || growth.isError) {
    return (
      <Alert severity="error">
        Failed to load analytics data. Please refresh.
      </Alert>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Row 1 — time series */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ChartCard
            title="Daily uploads"
            subtitle="Last 30 days"
            loading={isLoading}
          >
            {resources.data && (
              <UploadsLineChart data={resources.data.dailyUploads} />
            )}
          </ChartCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ChartCard
            title="Approval status"
            subtitle="All resources"
            loading={isLoading}
          >
            {resources.data && (
              <ApprovalDonut data={resources.data.approvalFunnel} />
            )}
          </ChartCard>
        </Grid>
      </Grid>

      {/* Row 2 — distributions */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ChartCard title="By file type" loading={isLoading} height={220}>
            {resources.data && (
              <FileTypeBarChart data={resources.data.byFileType} />
            )}
          </ChartCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ChartCard
            title="By subject"
            subtitle="Top 8"
            loading={isLoading}
            height={220}
          >
            {resources.data && (
              <SubjectBarChart data={resources.data.bySubject} />
            )}
          </ChartCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ChartCard
            title="User registrations"
            subtitle="Last 30 days"
            loading={isLoading}
          >
            {growth.data && (
              <UserGrowthChart data={growth.data.dailyRegistrations} />
            )}
          </ChartCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <ChartCard title="Top contributors" loading={isLoading} height={220}>
            {resources.data && (
              <TopContributorsTable data={resources.data.topContributors} />
            )}
          </ChartCard>
        </Grid>
      </Grid>

      {/* Row 3 — single metric */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Avg. time to approval
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {isLoading ? "—" : `${resources.data?.avgApprovalHours}h`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              across all approved resources
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
