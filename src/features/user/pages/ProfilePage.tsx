import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Tab,
  Tabs,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

import { useMyProfile, useUpdateProfile } from "../hooks/profile-hooks";
import { useOwnPosts } from "@/features/community/hooks/community.hooks";
import {
  useDeleteResource,
  useMyResources,
} from "@/features/resources/hooks/resource.hooks";
import { ApprovalStatus } from "@/shared/types/enums";
import type { Resource } from "@/features/resources/types/resource.dto";
import { EditResourceModal } from "@/features/resources/components/EditResourceModal";

import ProfileHero from "../components/ProfileHero";
import ProfilePostsTab from "../components/ProfilePostsTab";
import ProfileResourcesTab from "../components/ProfileResourcesTab";
import ProfileSettingsTab from "../components/ProfileSettingsTab";
import { toProfileUserViewModel } from "../types/profile.types";

// ─── Tab panel wrapper ────────────────────────────────────────────────────────
const TabPanel = ({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    sx={{ pt: 3, display: value === index ? "block" : "none" }}
  >
    {value === index && children}
  </Box>
);

// ─── Component ────────────────────────────────────────────────────────────────
const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [resourceFilter, setResourceFilter] = useState<ApprovalStatus | "all">(
    "all",
  );
  const [editTarget, setEditTarget] = useState<Resource | null>(null);

  // ── Data hooks ──────────────────────────────────────────────────────────────
  const { data: profile, isLoading: profileLoading } = useMyProfile();

  const {
    data: postsData,
    isLoading: postsLoading,
    isFetchingNextPage: postsFetchingNext,
    hasNextPage: postsHasNext,
    fetchNextPage: postsFetchNext,
  } = useOwnPosts();

  const resourceParams = resourceFilter === "all" ? {} : { status: resourceFilter };

  const {
    data: resourcesData,
    isLoading: resourcesLoading,
    isFetchingNextPage: resourcesFetchingNext,
    hasNextPage: resourcesHasNext,
    fetchNextPage: resourcesFetchNext,
  } = useMyResources(resourceParams);
  const { data: approvedResourcesData } = useMyResources({
    status: ApprovalStatus.APPROVED,
  });
  const { data: pendingResourcesData } = useMyResources({
    status: ApprovalStatus.PENDING,
  });
  const { data: rejectedResourcesData } = useMyResources({
    status: ApprovalStatus.REJECTED,
  });

  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();
  const { mutate: deleteResource } = useDeleteResource();
  const profileView = toProfileUserViewModel(profile);

  // ── Derived stats ───────────────────────────────────────────────────────────
  const stats = {
    totalPosts:
      postsData?.pages[0]?.total ??
      postsData?.pages.flatMap((page) => page.data).length ??
      0,
    approvedResources: approvedResourcesData?.pages[0]?.total ?? 0,
    pendingResources: pendingResourcesData?.pages[0]?.total ?? 0,
    rejectedResources: rejectedResourcesData?.pages[0]?.total ?? 0,
  };

  const handleDeleteResource = (resource: Resource) => {
    if (window.confirm(`Delete "${resource.title}"?`)) {
      deleteResource(resource._id);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="md" disableGutters={{ xs: true, sm: false } as any}>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <ProfileHero
          user={profileView}
          stats={stats}
          isLoading={profileLoading}
          actions={
            <Button
              variant="outlined"
              startIcon={<Edit />}
              size="small"
              onClick={() => setActiveTab(2)}
              sx={{
                textTransform: "none",
                borderColor: "rgba(108,99,255,0.4)",
                color: "#6C63FF",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#6C63FF",
                  background: "rgba(108,99,255,0.08)",
                },
              }}
            >
              Edit Profile
            </Button>
          }
        />

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        <Box
          sx={{
            px: { xs: 0, sm: 0 },
            mt: { xs: 0, sm: 2 },
          }}
        >
          <Box
            sx={{
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              px: { xs: 2, sm: 0 },
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "text.secondary",
                  minHeight: 48,
                  "&.Mui-selected": {
                    color: "#6C63FF",
                    fontWeight: 700,
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#6C63FF",
                  height: 2,
                  borderRadius: "2px 2px 0 0",
                },
              }}
            >
              <Tab label="Posts" />
              <Tab label="Resources" />
              <Tab label="Settings" />
            </Tabs>
          </Box>

          <Box sx={{ px: { xs: 2, sm: 0 } }}>
            {/* Posts tab */}
            <TabPanel value={activeTab} index={0}>
              <ProfilePostsTab
                pages={postsData?.pages}
                isLoading={postsLoading}
                isFetchingNextPage={postsFetchingNext}
                hasNextPage={postsHasNext}
                fetchNextPage={postsFetchNext}
              />
            </TabPanel>

            {/* Resources tab */}
            <TabPanel value={activeTab} index={1}>
              <ProfileResourcesTab
                pages={resourcesData?.pages}
                isLoading={resourcesLoading}
                isFetchingNextPage={resourcesFetchingNext}
                hasNextPage={resourcesHasNext}
                fetchNextPage={resourcesFetchNext}
                publicView={false}
                statusFilter={resourceFilter}
                onStatusFilterChange={setResourceFilter}
                onEditResource={setEditTarget}
                onDeleteResource={handleDeleteResource}
              />
            </TabPanel>

            {/* Settings tab */}
            <TabPanel value={activeTab} index={2}>
              <ProfileSettingsTab
                user={profileView}
                onSave={updateProfile}
                isSaving={isSaving}
              />
            </TabPanel>
          </Box>
        </Box>
      </Container>
      <EditResourceModal
        open={Boolean(editTarget)}
        resource={editTarget}
        onClose={() => setEditTarget(null)}
      />
    </Box>
  );
};

export default ProfilePage;
