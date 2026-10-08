import { useState, useEffect } from "react";
import { orderMessages } from "../helpers/orderMessages";
//Хук для управления сообщениями в чате
export function useChatMessages (session, activeChat) {
  const [messagesByChat, setMessagesByChat] = useState({})

  useEffect(() => {
    if (!session?.api || !activeChat) return;

    let cancelled = false;
    //Загружает историю выбранного чата
    async function loadHistory() {
      try {
        const history = await session.api.getChatHistory(activeChat.chatId, 100);
        if (!cancelled) {
          setMessagesByChat((prev) => ({
            ...prev,
            [activeChat.chatId]: orderMessages(history),
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [session, activeChat?.chatId]);
  //Обновляет список вообщений конкретного чата
    function updateMessages(chatId, messages) {
    setMessagesByChat((prev) => ({
      ...prev,
      [chatId]: messages,
    }));
  }
  //Очищает сообщение при выходе из чата
  function clearMessages() {
    setMessagesByChat({});
  }

  return {
    updateMessages,
    clearMessages,
    messagesByChat
  }
}