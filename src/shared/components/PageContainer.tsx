import { Box } from "@mui/material";
import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material";

export function PageContainer({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box sx={[{ height: "100%", overflowY: "auto" }, sx]}>
      {children}
    </Box>
  );
}
