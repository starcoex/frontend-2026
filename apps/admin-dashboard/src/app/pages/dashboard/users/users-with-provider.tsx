import { UsersProvider } from '@starcoex-frontend/auth';
import { UsersLayout } from '@/app/pages/dashboard/users/users-layout';

export const UsersWithProvider = () => {
  return (
    <UsersProvider>
      <UsersLayout />
    </UsersProvider>
  );
};
