// features/user/components/ChangePasswordForm.tsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/LockOutlined";
import { useUpdateProfile } from "../hooks/profile-hooks";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface FormValues {
  password: string;
  confirmPassword: string;
}

export const ChangePasswordForm = () => {
  const [showPw, setShowPw] = useState(false);
  const { mutate, isPending } = useUpdateProfile();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const pwValue = watch("password");

  const onSubmit = ({ password }: FormValues) => {
    mutate({ password }, { onSuccess: () => reset() });
  };

  // Inside your ChangePasswordForm component
  const toggleVisibility = (
    <InputAdornment position="end">
      <IconButton onClick={() => setShowPw((v) => !v)} edge="end">
        {/* Assuming you want to swap icons based on visibility */}
        {showPw ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box component="div">
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Change Password
      </Typography>
      <Stack spacing={2.5}>
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="New Password"
              type={showPw ? "text" : "password"}
              fullWidth
              size="small"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{ endAdornment: toggleVisibility }}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Please confirm your password",
            validate: (v) => v === pwValue || "Passwords do not match",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Confirm Password"
              type={showPw ? "text" : "password"}
              fullWidth
              size="small"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{ endAdornment: toggleVisibility }}
            />
          )}
        />

        <Box>
          <Button
            variant="contained"
            startIcon={<LockIcon />}
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
