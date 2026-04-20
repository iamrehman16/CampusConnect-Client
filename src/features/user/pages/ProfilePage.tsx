// features/user/pages/ProfilePage.tsx
import { useState } from "react";
import { Box, CircularProgress, Container, Stack, Tab, Tabs, Typography } from "@mui/material";
import { ProfileHeader }   from "../components/ProfileHeader";
import { ResourcesSection } from "../components/ResourceSection";
import { PostsSection }     from "../components/PostsSection";
import { SettingsTab }      from "../components/SettingsTab";
import { useMyProfile } from "../hooks/profile-hooks";
import { useMyResources } from "@/features/resources/hooks/resource.hooks";
import { useOwnPosts }      from "@/features/community/hooks/community.hooks";
import { ApprovalStatus } from "@/shared/types/enums";

// Profile tab index constants — avoids magic numbers
const TAB_PROFILE  = 0;
const TAB_SETTINGS = 1;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(TAB_PROFILE);

  const { data: user, isLoading, isError } = useMyProfile();

  // Fetch counts for stats strip — use total from first page metadata
  const { data: resourceData } = useMyResources({ status: ApprovalStatus.APPROVED });
  const { data: postData }     = useOwnPosts();

  const resourceCount = resourceData?.pages[0]?.total ?? 0;
  const postCount     = postData?.pages[0]?.total     ?? 0;

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
        Failed to load profile.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <ProfileHeader
        user={user}
        isOwner
        resourceCount={resourceCount}
        postCount={postCount}
        onEditClick={() => setActiveTab(TAB_SETTINGS)}
      />

      <Box sx={{ mt: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{ borderBottom: "1px solid", borderColor: "divider", mb: 3 }}
        >
          <Tab label="Profile"  sx={{ textTransform: "none" }} />
          <Tab label="Settings" sx={{ textTransform: "none" }} />
        </Tabs>

        {activeTab === TAB_PROFILE && (
          <Stack spacing={4}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Resources
              </Typography>
              <ResourcesSection isOwner />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Posts
              </Typography>
              <PostsSection isOwner />
            </Box>
          </Stack>
        )}

        {activeTab === TAB_SETTINGS && <SettingsTab user={user} />}
      </Box>
    </Container>
  );
};

export default ProfilePage;