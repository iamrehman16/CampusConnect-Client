// features/user/pages/PublicProfilePage.tsx
import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { ProfileHeader } from "../components/ProfileHeader";
import { ResourcesSection } from "../components/ResourceSection";
import { PostsSection } from "../components/PostsSection";
import { useUserProfile } from "../hooks/profile-hooks";
import { useResourcesByUser } from "@/features/resources/hooks/resource.hooks";
import { usePostsByUser } from "@/features/community/hooks/community.hooks";
import { ApprovalStatus } from "@/shared/types/enums";

const PublicProfilePage = () => {
  const { userId = "" } = useParams<{ userId: string }>();

  const { data: user, isLoading, isError } = useUserProfile(userId);

  // Fetch counts for stats strip
  const { data: resourceData } = useResourcesByUser(userId, {
    status: ApprovalStatus.APPROVED,
  });
  const { data: postData } = usePostsByUser(userId);

  const resourceCount = resourceData?.pages[0]?.total ?? 0;
  const postCount = postData?.pages[0]?.total ?? 0;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !user) {
    return (
      <Typography color="error" sx={{ textAlign: "center", py: 10 }}>
        User not found.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <ProfileHeader
        user={user}
        isOwner={false}
        resourceCount={resourceCount}
        postCount={postCount}
      />

      <Stack spacing={4} sx={{ mt: 3 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Resources
          </Typography>
          <ResourcesSection isOwner={false} userId={userId} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Posts
          </Typography>
          <PostsSection isOwner={false} userId={userId} />
        </Box>
      </Stack>
    </Container>
  );
};


export default PublicProfilePage;