// features/user/components/SettingsTab.tsx
import { Box, Divider, Stack, Typography } from "@mui/material";
import { EditProfileForm } from "./EditProfileForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import type { User } from "@/shared/types/auth.types";

export const SettingsTab = ({ user }: { user: User }) => (
  <Stack spacing={4} sx={{ maxWidth: 560 }}>
    <EditProfileForm user={user} />

    <Divider />

    <ChangePasswordForm />

    <Divider />

    {/* Account info — read-only, just transparency for the user */}
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Account
      </Typography>
      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          Email:{" "}
          <Box component="span" sx={{ color: "text.primary" }}>
            {user.email}
          </Box>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Role:{" "}
          <Box
            component="span"
            sx={{ color: "text.primary", textTransform: "capitalize" }}
          >
            {user.role.toLowerCase()}
          </Box>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Member since:{" "}
          <Box component="span" sx={{ color: "text.primary" }}>
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Box>
        </Typography>
      </Stack>
    </Box>
  </Stack>
);
