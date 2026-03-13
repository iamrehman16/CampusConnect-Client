# User Feature

Handles all user profile and user-related operations.

## Structure

- `api/userService.ts` - User API operations (fetch, update profile)
- `session/userSession.ts` - User data persistence to localStorage
- `context/UserContext.tsx` - User state management
- `types/index.ts` - User type definitions

## Usage

```tsx
import { useUser } from '@/features/users/context/UserContext';

const MyComponent = () => {
  const { user, updateUser } = useUser();
  // Use user data and update functions
};
```

## Integration with Auth

- Auth feature imports User type from user feature
- Auth service persists user data via userSession
- User data is cleared on logout via authService
