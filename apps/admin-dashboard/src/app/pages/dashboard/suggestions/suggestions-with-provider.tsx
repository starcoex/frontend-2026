import { SuggestionsProvider } from '@starcoex-frontend/suggestions';
import { SuggestionsLayout } from '@/app/pages/dashboard/suggestions/suggestions-layout';

export const SuggestionsWithProvider = () => {
  return (
    <SuggestionsProvider>
      <SuggestionsLayout />
    </SuggestionsProvider>
  );
};
