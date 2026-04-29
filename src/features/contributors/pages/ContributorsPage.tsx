import { Box, Typography } from "@mui/material";
import { ContributorGrid } from "../components/ContributorGrid";
import { useUsers } from "@/features/user/hooks/user-hooks";

export default function ContributorsPage() {
  const { data, isLoading } = useUsers({ role: "Contributor" }); // UserFilterParam

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Contributors
      </Typography>
      <ContributorGrid users={data?.data ?? []} isLoading={isLoading} />
    </Box>
  );
}
