import { Box } from "@mui/material";
import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ height: "100%", overflowY: "auto" }}>
      {children}
    </Box>
  );
}
