import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import communityService from "../services/community.service";
import { communityKeys } from "./community.keys";
import type {
  CreateCommentDto,
  CreatePostDto,
  UpdateCommentDto,
  UpdatePostDto,
} from "../types/community.dto";
import { PAGE_LIMIT } from "@/shared/types/api.types";

// ─── Queries ──────────────────────────────────────────────────────────────────

export const usePosts = () =>
  useInfiniteQuery({
    queryKey: communityKeys.lists(),
    queryFn: ({ pageParam }: { pageParam: number }) =>
      communityService.getPosts({ page: pageParam, limit: PAGE_LIMIT }),
    initialPageParam: 1 as number,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });

export const useComments = (postId: string) =>
  useInfiniteQuery({
    queryKey: communityKeys.comments(postId),
    queryFn: ({ pageParam }: { pageParam: number }) =>
      communityService.getCommentsByPostId(postId, {
        page: pageParam,
        limit: PAGE_LIMIT,
      }),
    initialPageParam: 1 as number,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
    enabled: !!postId,
  });

export const useStats = () => {
  return useQuery({
    queryKey: communityKeys.stats(),
    queryFn: () => communityService.getPostStats(),
    staleTime: 1000 * 60 * 5,
  });
};

// ─── Post mutations ───────────────────────────────────────────────────────────

export const useCreatePost = () => {
  const { invalidatePosts } = useCommunityInvalidation();
  return useMutation({
    mutationFn: (dto: CreatePostDto) => communityService.createPost(dto),
    onSuccess: invalidatePosts,
  });
};

export const useUpdatePost = () => {
  const { invalidatePosts } = useCommunityInvalidation();
  return useMutation({
    mutationFn: ({ postId, dto }: { postId: string; dto: UpdatePostDto }) =>
      communityService.updateOwnPost(postId, dto),
    onSuccess: invalidatePosts,
  });
};

export const useDeletePost = () => {
  const { invalidatePosts } = useCommunityInvalidation();
  return useMutation({
    mutationFn: (postId: string) => communityService.deleteOwnPost(postId),
    onSuccess: invalidatePosts,
  });
};

export const useToggleUpvote = () => {
  const { invalidatePosts } = useCommunityInvalidation();
  return useMutation({
    mutationFn: (postId: string) => communityService.toggleUpvote(postId),
    onSuccess: invalidatePosts,
  });
};

// ─── Comment mutations ────────────────────────────────────────────────────────

export const useCreateComment = (postId: string) => {
  const { invalidatePosts, invalidateComments } = useCommunityInvalidation();
  return useMutation({
    mutationFn: (dto: CreateCommentDto) =>
      communityService.createComment(postId, dto),
    onSuccess: () => {
      invalidateComments(postId);
      invalidatePosts();
    },
  });
};

export const useUpdateComment = (postId: string) => {
  const { invalidateComments } = useCommunityInvalidation();
  return useMutation({
    mutationFn: ({
      commentId,
      dto,
    }: {
      commentId: string;
      dto: UpdateCommentDto;
    }) => communityService.updateOwnComment(commentId, dto),
    onSuccess: () => invalidateComments(postId),
  });
};

export const useDeleteComment = (postId: string) => {
  const { invalidatePosts, invalidateComments } = useCommunityInvalidation();
  return useMutation({
    mutationFn: (commentId: string) =>
      communityService.deleteOwnComment(commentId),
    onSuccess: () => {
      invalidateComments(postId);
      invalidatePosts();
    },
  });
};


// Helper Hooks
const useCommunityInvalidation = () => {
  const queryClient = useQueryClient();
  return {
    invalidatePosts: () =>
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() }),
    invalidateComments: (postId: string) =>
      queryClient.invalidateQueries({ queryKey: communityKeys.comments(postId) }),
  };
};