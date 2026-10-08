import { useEffect } from "react";
//Хук для получения новых сообщения из API
export function useNotification({session, onMessage, onChatUpdate}) {
  useEffect(() => {
    if (!session?.api) return;

    let cancelled = false;
    //Ожидает новые уведомления из API
    async function listen() {
      while (!cancelled) {
        try {
          const notification = await session.api.receiveNotification(5);

          if (cancelled || !notification) continue;

          const body = notification.body;

          if (
            body?.typeWebhook === "incomingMessageReceived" || body?.typeWebhook === "outgoingMessageReceived"
          ) {
            const chatId = body?.senderData?.chatId;
            const text = body?.messageData?.textMessageData?.textMessage ||
              body?.messageData?.textMessage ||
              "";

            if (chatId && text) {
              const message = {
                idMessage: body.idMessage,
                type:
                  body.typeWebhook === "outgoingMessageReceived"
                    ? "outgoing"
                    : "incoming",
                timestamp: body.timestamp,
                textMessage: text,
              };
              onMessage(chatId, message);

              onChatUpdate(chatId, {
                lastMessage: {
                  text,
                  timestamp: body.timestamp
                }
              });
            }
          }

          await session.api.deleteNotification(notification.receiptId);

        } catch (err) {
          if (!cancelled) {
            console.error("Receive notification failed", err);
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
        }
      }
    }

    listen();

    return () => {
      cancelled = true;
    };
  }, [session, onMessage, onChatUpdate]);

}