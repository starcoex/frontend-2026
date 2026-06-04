import { ChatProvider } from '@starcoex-frontend/chats';
import { ChatsLayout } from '@/app/pages/dashboard/ecommerce/chat/chats-layout';
import { MediaProvider } from '@starcoex-frontend/media';

export const ChatsWithProvider = () => {
  return (
    <ChatProvider>
      <MediaProvider>
        <ChatsLayout />
      </MediaProvider>
    </ChatProvider>
  );
};
