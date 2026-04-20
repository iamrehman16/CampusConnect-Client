// features/user/components/PostsSection.tsx
import { useRef, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { PostCard } from "@/features/community/components/PostCard";
import {
  useOwnPosts,
  usePostsByUser,
} from "@/features/community/hooks/community.hooks";

interface PostsSectionProps {
  isOwner: boolean;
  /** Required when isOwner is false */
  userId?: string;
}

// ─── Shared list renderer ─────────────────────────────────────────────────────
const PostList = ({
  posts,
  isLoading,
  isFetchingNextPage,
  sentinelRef,
}: {
  posts: any[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  sentinelRef: React.Ref<HTMLDivElement>;
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }
      console.log("Here!!! : ", posts);


  if (posts.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        No posts yet.
      </Typography>
    );
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {posts.map((p) => (
        <PostCard key={p._id} post={p} />
      ))}
      <Box
        ref={sentinelRef}
        sx={{ py: 1, display: "flex", justifyContent: "center" }}
      >
        {isFetchingNextPage && <CircularProgress size={24} />}
      </Box>
    </Box>
  );
};

// ─── Owner view ───────────────────────────────────────────────────────────────
const OwnPostsSection = () => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useOwnPosts();

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

  return (
    <PostList
      posts={data?.pages.flatMap((p) => p.data) ?? []}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      sentinelRef={sentinelRef}
    />
  );
};

// ─── Public view ──────────────────────────────────────────────────────────────
const PublicPostsSection = ({ userId }: { userId: string }) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePostsByUser(userId);

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

  return (
    <PostList
      posts={data?.pages.flatMap((p) => p.data) ?? []}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      sentinelRef={sentinelRef}
    />
  );
};

// ─── Export ───────────────────────────────────────────────────────────────────
export const PostsSection = ({ isOwner, userId }: PostsSectionProps) => {
  if (isOwner) return <OwnPostsSection />;
  if (!userId) return null;
  return <PublicPostsSection userId={userId} />;
};
