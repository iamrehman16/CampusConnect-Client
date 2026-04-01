
export const communityKeys = {
  all: ["posts"] as const,
  lists: () => [...communityKeys.all, "list"] as const,
  list: (params: object) => [...communityKeys.lists(), params] as const,
  detail: (postId: string) => [...communityKeys.all, postId] as const,
  comments: (postId: string) => [...communityKeys.detail(postId), "comments"] as const,
  commentList: (postId: string, params: object) =>
    [...communityKeys.comments(postId), params] as const,
};