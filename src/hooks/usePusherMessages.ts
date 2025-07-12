import { useEffect } from "react";
import Pusher from "pusher-js";

export function usePusherMessages(conversationId: string, onMessage: (msg: unknown) => void) {
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusher.subscribe(`conversation-${conversationId}`);
    channel.bind("new-message", onMessage);

    return () => {
      channel.unbind("new-message", onMessage);
      pusher.unsubscribe(`conversation-${conversationId}`);
      pusher.disconnect();
    };
  }, [conversationId, onMessage]);
} 