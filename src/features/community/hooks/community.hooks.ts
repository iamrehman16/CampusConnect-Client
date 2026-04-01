// community.hooks.ts
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
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

// ─── Shared invalidation helpers ──────────────────────────────────────────────

const useInvalidatePosts = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
};

const useInvalidateComments = (postId: string) => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: communityKeys.comments(postId) });
};

// ─── Post Mutations ───────────────────────────────────────────────────────────

export const useCreatePost = () => {
  const invalidatePosts = useInvalidatePosts();
  return useMutation({
    mutationFn: (dto: CreatePostDto) => communityService.createPost(dto),
    onSuccess: invalidatePosts,
  });
};

export const useUpdatePost = () => {
  const invalidatePosts = useInvalidatePosts();
  return useMutation({
    mutationFn: ({ postId, dto }: { postId: string; dto: UpdatePostDto }) =>
      communityService.updateOwnPost(postId, dto),
    onSuccess: invalidatePosts,
  });
};

export const useDeletePost = () => {
  const invalidatePosts = useInvalidatePosts();
  return useMutation({
    mutationFn: (postId: string) => communityService.deleteOwnPost(postId),
    onSuccess: invalidatePosts,
  });
};

export const useToggleUpvote = () => {
  const invalidatePosts = useInvalidatePosts();
  return useMutation({
    mutationFn: (postId: string) => communityService.toggleUpvote(postId),
    onSuccess: invalidatePosts,
  });
};

// ─── Comment Mutations ────────────────────────────────────────────────────────

export const useCreateComment = (postId: string) => {
  const invalidateComments = useInvalidateComments(postId);
  const invalidatePosts = useInvalidatePosts();
  return useMutation({
    mutationFn: (dto: CreateCommentDto) =>
      communityService.createComment(postId, dto),
    onSuccess: () => {
      invalidateComments();
      invalidatePosts();
    },
  });
};

export const useUpdateComment = (postId: string) => {
  const invalidateComments = useInvalidateComments(postId);
  return useMutation({
    mutationFn: ({
      commentId,
      dto,
    }: {
      commentId: string;
      dto: UpdateCommentDto;
    }) => communityService.updateOwnComment(commentId, dto),
    onSuccess: invalidateComments,
  });
};

export const useDeleteComment = (postId: string) => {
  const invalidateComments = useInvalidateComments(postId);
  const invalidatePosts = useInvalidatePosts();
  return useMutation({
    mutationFn: (commentId: string) =>
      communityService.deleteOwnComment(commentId),
    onSuccess: () => {
      invalidateComments();
      invalidatePosts();
    },
  });
};