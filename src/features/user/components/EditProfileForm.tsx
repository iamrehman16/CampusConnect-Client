// features/user/components/EditProfileForm.tsx
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import { useUpdateProfile } from "../hooks/profile-hooks";
import type { User } from "@/shared/types/auth.types";

interface FormValues {
  name: string;
  academicInfo: string;
  expertise: string;
  semester: number | "";
}

export const EditProfileForm = ({ user }: { user: User }) => {
  const { mutate, isPending } = useUpdateProfile();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: user.name ?? "",
      academicInfo: user.academicInfo ?? "",
      expertise: user.expertise ?? "",
      semester: user.semester ?? "",
    },
  });

  // Re-sync defaults if user data updates in cache
  useEffect(() => {
    reset({
      name: user.name ?? "",
      academicInfo: user.academicInfo ?? "",
      expertise: user.expertise ?? "",
      semester: user.semester ?? "",
    });
  }, [user, reset]);

  const onSubmit = (values: FormValues) => {
    mutate({
      name: values.name || undefined,
      academicInfo: values.academicInfo || undefined,
      expertise: values.expertise || undefined,
      semester: values.semester || undefined,
    });
  };

  return (
    <Box component="div">
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Personal Info
      </Typography>
      <Stack spacing={2.5}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Display Name"
              fullWidth
              size="small"
              autoComplete="off"
            />
          )}
        />

        <Controller
          name="academicInfo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Academic Info"
              placeholder="e.g. BS Computer Science, QAU"
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          )}
        />

        <Controller
          name="expertise"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Expertise / Skills"
              placeholder="e.g. Machine Learning, Web Dev, DSA"
              helperText="Comma-separated — shown as tags on your profile"
              fullWidth
              size="small"
            />
          )}
        />

        <Controller
          name="semester"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Semester"
              fullWidth
              size="small"
            >
              <MenuItem value="">
                <em>Not specified</em>
              </MenuItem>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <MenuItem key={n} value={n}>
                  Semester {n}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Box>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
