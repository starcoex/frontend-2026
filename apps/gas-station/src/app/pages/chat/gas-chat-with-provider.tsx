import { ChatProvider } from '@starcoex-frontend/chats';
import { GasChatPage } from './gas-chat-page';

export function GasChatWithProvider() {
  return (
    <ChatProvider>
      <GasChatPage />
    </ChatProvider>
  );
}
