import { RouterProvider } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import router from './router';

/**
 * Root application component.
 * Wraps the router in all required providers.
 */
export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
