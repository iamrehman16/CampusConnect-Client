import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  MobileStepper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  ToggleButton,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useCompleteOnboarding } from "../hooks/useCompleteOnboarding";
import type { CompleteOnboardingRequest } from "../types/auth.dto";
import { useAuth } from "@/shared/hooks/useAuth";

import alpha1 from "@/assets/avatars/alpha1.svg";
import alpha2 from "@/assets/avatars/alpha2.svg";
import alpha3 from "@/assets/avatars/alpha3.svg";
import alpha4 from "@/assets/avatars/alpha4.svg";
import beta1 from "@/assets/avatars/beta1.svg";
import beta2 from "@/assets/avatars/beta2.svg";
import beta3 from "@/assets/avatars/beta3.svg";
import beta4 from "@/assets/avatars/beta4.svg";

// ── Static data ──────────────────────────────────────────────────────

const DEPARTMENTS = [
  "Computer Science",
  "Software Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Business Administration",
  "Mathematics",
  "Physics",
  "Economics",
  "Other",
];

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const INTEREST_OPTIONS = [
  "Web Development",
  "Mobile Development",
  "AI / ML",
  "Data Science",
  "Cloud & DevOps",
  "Cybersecurity",
  "Embedded Systems",
  "UI / UX Design",
  "Open Source",
  "Research",
  "Entrepreneurship",
  "Game Development",
];

const EXPERTISE_OPTIONS = [
  "JavaScript / TypeScript",
  "Python",
  "C / C++",
  "Java",
  "React",
  "Node.js",
  "Databases",
  "System Design",
  "Algorithms & DSA",
  "Machine Learning",
  "Networking",
  "Linux / Shell",
];

// avatar filenames live under assets/avatars/
// naming: alpha1–alphaN (one group), beta1–betaN (another group)
const AVATARS = [
  "alpha1",
  "alpha2",
  "alpha3",
  "alpha4",
  "beta1",
  "beta2",
  "beta3",
  "beta4",
];

const AVATAR_IMAGES: Record<string, string> = {
  alpha1,
  alpha2,
  alpha3,
  alpha4,
  beta1,
  beta2,
  beta3,
  beta4,
};

const STEPS = ["Profile", "Academic", "Interests", "Avatar"];

// ── Types ────────────────────────────────────────────────────────────

type FormValues = CompleteOnboardingRequest & {
  displayName: string;
  bio: string;
};

// ── Step sub-components ──────────────────────────────────────────────

function StepProfile({
  control,
  userName,
}: {
  control: any;
  userName: string;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Hey, {userName.split(" ")[0]} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Let's set up your CampusConnect profile. This helps peers and mentors
          find you.
        </Typography>
      </Box>

      <Controller
        name="displayName"
        control={control}
        rules={{ required: "Display name is required" }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Display Name"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="bio"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Short Bio (optional)"
            placeholder="e.g. Final-year CS student passionate about AI and open source"
            fullWidth
            multiline
            rows={3}
            inputProps={{ maxLength: 200 }}
            helperText={`${field.value?.length ?? 0}/200`}
          />
        )}
      />
    </Box>
  );
}

function StepAcademic({ control }: { control: any }) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Academic Info
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We use this to surface relevant resources and connect you with the
          right mentors.
        </Typography>
      </Box>

      <Controller
        name="department"
        control={control}
        rules={{ required: "Department is required" }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select
            label="Department"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            SelectProps={{ native: true }}
          >
            <option value="" disabled />
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </TextField>
        )}
      />

      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Current Semester
        </Typography>
        <Controller
          name="semester"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {SEMESTERS.map((s) => (
                <ToggleButton
                  key={s}
                  value={s}
                  selected={field.value === s}
                  onChange={() => field.onChange(s)}
                  size="small"
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50% !important",
                    border: `1px solid ${theme.palette.divider} !important`,
                    fontWeight: 600,
                    "&.Mui-selected": {
                      background: theme.palette.primary.main,
                      color: "#fff",
                      borderColor: `${theme.palette.primary.main} !important`,
                    },
                  }}
                >
                  {s}
                </ToggleButton>
              ))}
            </Box>
          )}
        />
      </Box>
    </Box>
  );
}

function StepInterests({ control }: { control: any }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Interests & Expertise
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pick what excites you and what you're good at. Select as many as you
          like.
        </Typography>
      </Box>

      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Interests
        </Typography>
        <Controller
          name="interests"
          control={control}
          render={({ field }) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {INTEREST_OPTIONS.map((opt) => {
                const selected = (field.value as string[]).includes(opt);
                return (
                  <Chip
                    key={opt}
                    label={opt}
                    clickable
                    color={selected ? "primary" : "default"}
                    variant={selected ? "filled" : "outlined"}
                    onClick={() => {
                      const current = field.value as string[];
                      field.onChange(
                        selected
                          ? current.filter((v) => v !== opt)
                          : [...current, opt],
                      );
                    }}
                  />
                );
              })}
            </Box>
          )}
        />
      </Box>

      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Expertise
        </Typography>
        <Controller
          name="expertise"
          control={control}
          render={({ field }) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {EXPERTISE_OPTIONS.map((opt) => {
                const selected = (field.value as string[]).includes(opt);
                return (
                  <Chip
                    key={opt}
                    label={opt}
                    clickable
                    color={selected ? "secondary" : "default"}
                    variant={selected ? "filled" : "outlined"}
                    onClick={() => {
                      const current = field.value as string[];
                      field.onChange(
                        selected
                          ? current.filter((v) => v !== opt)
                          : [...current, opt],
                      );
                    }}
                  />
                );
              })}
            </Box>
          )}
        />
      </Box>
    </Box>
  );
}

function StepAvatar({ control }: { control: any }) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Pick your Avatar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is how you'll appear across CampusConnect.
        </Typography>
      </Box>

      <Controller
        name="avatar"
        control={control}
        rules={{ required: "Please pick an avatar" }}
        render={({ field, fieldState }) => (
          <Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
                gap: 1.5,
              }}
            >
              {AVATARS.map((name) => {
                const selected = field.value === name;
                return (
                  <Box
                    key={name}
                    onClick={() => field.onChange(name)}
                    sx={{
                      borderRadius: 2,
                      border: `2px solid`,
                      borderColor: selected
                        ? theme.palette.primary.main
                        : "transparent",
                      cursor: "pointer",
                      overflow: "hidden",
                      aspectRatio: "1",
                      background: selected
                        ? alpha(theme.palette.primary.main, 0.12)
                        : alpha(theme.palette.common.white, 0.04),
                      transition: "border-color 0.15s, background 0.15s",
                      "&:hover": {
                        borderColor: selected
                          ? theme.palette.primary.main
                          : theme.palette.divider,
                      },
                    }}
                  >
                    <img src={AVATAR_IMAGES[name]} alt={name} />
                  </Box>
                );
              })}
            </Box>
            {fieldState.error && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, display: "block" }}
              >
                {fieldState.error.message}
              </Typography>
            )}
          </Box>
        )}
      />

      <Controller
        name="isOpenToMentor"
        control={control}
        render={({ field }) => (
          <Box
            onClick={() => field.onChange(!field.value)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderRadius: 2,
              border: `1px solid`,
              borderColor: field.value ? "primary.main" : "divider",
              background: field.value
                ? (theme) => alpha(theme.palette.primary.main, 0.08)
                : "transparent",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <Box>
              <Typography variant="body1" fontWeight={600}>
                Open to Mentoring
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Let junior students send you mentor requests
              </Typography>
            </Box>
            <Box
              sx={{
                width: 40,
                height: 22,
                borderRadius: 11,
                background: field.value ? "primary.main" : "action.disabled",
                bgcolor: field.value ? "primary.main" : "action.disabled",
                position: "relative",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 3,
                  left: field.value ? 21 : 3,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: "common.white",
                  transition: "left 0.15s",
                }}
              />
            </Box>
          </Box>
        )}
      />
    </Box>
  );
}

// ── Main Page ────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const { mutate: completeOnboarding, isPending } = useCompleteOnboarding();
  const [activeStep, setActiveStep] = useState(0);

  const { control, handleSubmit, trigger, getValues } = useForm<FormValues>({
    defaultValues: {
      displayName: user?.name ?? "",
      bio: "",
      department: "",
      semester: undefined,
      interests: [],
      expertise: [],
      avatar: "",
      isOpenToMentor: false,
    },
  });

  // Fields to validate per step before advancing
  const STEP_FIELDS: (keyof FormValues)[][] = [
    ["displayName"],
    ["department", "semester"],
    [], // interests/expertise optional
    ["avatar"],
  ];

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[activeStep] as any);
    if (valid) setActiveStep((s) => s + 1);
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  const onSubmit = (values: FormValues) => {
    const { displayName, bio, ...rest } = values;
    completeOnboarding({
      ...rest,
      name: displayName,
      academicInfo: bio,
    } as CompleteOnboardingRequest);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.palette.background.default,
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 0.5,
            }}
          >
            CampusConnect
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Step {activeStep + 1} of {STEPS.length}
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Card */}
        <Box
          sx={{
            background: theme.palette.background.paper,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            p: { xs: 3, sm: 4 },
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Step content */}
            <Box sx={{ minHeight: 320 }}>
              {activeStep === 0 && (
                <StepProfile
                  control={control}
                  userName={user?.name ?? "there"}
                />
              )}
              {activeStep === 1 && <StepAcademic control={control} />}
              {activeStep === 2 && <StepInterests control={control} />}
              {activeStep === 3 && <StepAvatar control={control} />}
            </Box>

            {/* Navigation */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
                pt: 3,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                variant="text"
                color="inherit"
              >
                Back
              </Button>

              {activeStep < STEPS.length - 1 ? (
                <Button onClick={handleNext} variant="contained">
                  Continue
                </Button>
              ) : (
                <Button type="submit" variant="contained" disabled={isPending}>
                  {isPending ? "Setting up..." : "Get Started"}
                </Button>
              )}
            </Box>
          </form>
        </Box>

        {/* Mobile stepper dots (optional, for small screens) */}
        <MobileStepper
          variant="dots"
          steps={STEPS.length}
          position="static"
          activeStep={activeStep}
          nextButton={null}
          backButton={null}
          sx={{
            background: "transparent",
            justifyContent: "center",
            mt: 2,
            display: { sm: "none" },
          }}
        />
      </Container>
    </Box>
  );
}
