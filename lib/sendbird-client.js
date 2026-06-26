import SendbirdChat from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';

let sbInstance = null;

export function getSendbirdClient() {
  if (typeof window === 'undefined') return null;
  
  if (!sbInstance) {
    const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID;
    if (!appId) {
      console.warn("Sendbird App ID is missing from environment variables (NEXT_PUBLIC_SENDBIRD_APP_ID).");
      return null;
    }
    sbInstance = SendbirdChat.init({
      appId,
      modules: [new GroupChannelModule()],
    });
  }
  return sbInstance;
}
