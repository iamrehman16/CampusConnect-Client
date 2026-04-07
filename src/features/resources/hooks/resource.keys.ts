export const resourceKeys = {
  all: ["resources"] as const,

  // Public/Contributor lists
  lists: () => [...resourceKeys.all, "list"] as const,
  list: (params: object) => [...resourceKeys.lists(), params] as const,

  // Single resource
  details: () => [...resourceKeys.all, "detail"] as const,
  detail: (id: string) => [...resourceKeys.details(), id] as const,

  // Contributor's own resources
  mine: () => [...resourceKeys.all, "mine"] as const,
  myList: (params: object) => [...resourceKeys.mine(), params] as const,

  // Admin views
  admin: () => [...resourceKeys.all, "admin"] as const,
  adminPending: () => [...resourceKeys.admin(), "pending"] as const,
  adminPendingList: (params: object) =>
    [...resourceKeys.adminPending(), params] as const,
};
