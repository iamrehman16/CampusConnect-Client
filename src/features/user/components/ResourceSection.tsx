// features/user/components/ResourcesSection.tsx
import { useRef, useEffect } from "react";
import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { ResourceCard } from "@/features/resources/components/ResourceCard";
import {
  useMyResources,
  useResourcesByUser,
} from "@/features/resources/hooks/resource.hooks";
import { ApprovalStatus } from "@/shared/types/enums";

interface ResourcesSectionProps {
  isOwner: boolean;
  /** Required when isOwner is false */
  userId?: string;
}

const STATUS_TABS = [
  { label: "Approved", value: ApprovalStatus.APPROVED },
  { label: "Pending", value: ApprovalStatus.PENDING },
  { label: "Rejected", value: ApprovalStatus.REJECTED },
] as const;

// ─── Owner view (all statuses) ────────────────────────────────────────────────
const OwnResourcesSection = () => {
  const [status, setStatus] = useState<ApprovalStatus>(ApprovalStatus.APPROVED);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useMyResources({ status: status });

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) fetchNextPage();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const resources = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <Box>
      <Tabs
        value={status}
        onChange={(_, v) => setStatus(v)}
        sx={{ mb: 2, borderBottom: "1px solid", borderColor: "divider" }}
      >
        {STATUS_TABS.map((t) => (
          <Tab
            key={t.value}
            label={t.label}
            value={t.value}
            sx={{ textTransform: "none", fontSize: "0.875rem" }}
          />
        ))}
      </Tabs>
      <ResourceGrid resources={resources} isLoading={isLoading} />
      <Box
        ref={sentinelRef}
        sx={{ py: 1, display: "flex", justifyContent: "center" }}
      >
        {isFetchingNextPage && <CircularProgress size={24} />}
      </Box>
    </Box>
  );
};

// ─── Public view (approved only) ─────────────────────────────────────────────
const PublicResourcesSection = ({ userId }: { userId: string }) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useResourcesByUser(userId, { status: ApprovalStatus.APPROVED });

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) fetchNextPage();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const resources = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <Box>
      <ResourceGrid resources={resources} isLoading={isLoading} />
      <Box
        ref={sentinelRef}
        sx={{ py: 1, display: "flex", justifyContent: "center" }}
      >
        {isFetchingNextPage && <CircularProgress size={24} />}
      </Box>
    </Box>
  );
};

// ─── Shared grid ─────────────────────────────────────────────────────────────
const ResourceGrid = ({
  resources,
  isLoading,
}: {
  resources: any[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (resources.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        No resources found.
      </Typography>
    );
  }
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: 2,
      }}
    >
      {resources.map((r) => (
        <ResourceCard key={r._id} resource={r} />
      ))}
    </Box>
  );
};

// ─── Export ───────────────────────────────────────────────────────────────────
export const ResourcesSection = ({
  isOwner,
  userId,
}: ResourcesSectionProps) => {
  if (isOwner) return <OwnResourcesSection />;
  if (!userId) return null;
  return <PublicResourcesSection userId={userId} />;
};
