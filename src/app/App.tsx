import { RouterProvider } from "react-router-dom";
import AppProviders from "./providers/AppProviders";
import router from "./router";
import { PwaUpdatePrompt } from "@/shared/components/pwaUpdatePrompt";
export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      {import.meta.env.PROD && <PwaUpdatePrompt />}
    </AppProviders>
  );
}
