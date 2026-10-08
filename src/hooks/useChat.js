import { useState, useEffect } from "react";
//Хук для управления состоянием чата
export function useChat(session) {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session?.api) return;

    let cancelled = false;
    //Загружает историю чатов
    async function loadChats() {
      setLoading(true);
      try {
        const result = await session.api.getChats();
        if (!cancelled) {
          const userChats = (Array.isArray(result) ? result : []).filter((chat) => chat.type === "user" || chat.type === "bot");
          setChats(userChats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadChats();
    return () => {
      cancelled = true;
    };
  }, [session]);
  //Добавляет чат в список чатов
  function addChat(chat) {
    setChats((prev) => {
    const exists = prev.some((item) => item.chatId === chat.chatId);
    if (exists) 
    return prev.map((item) => item.chatId === chat.chatId ? { ...item, ...chat } : item);
    return [chat, ...prev];
  });
    setActiveChat(chat);
  }
  //Обновляет данные существующего чата
  function updateChat(chatId, data) {
    setChats((prev) =>
      prev.map((chat) =>
        chat.chatId === chatId ? { ...chat, ...data } : chat
      )
    );
  }
  //Очищает список чатов при выходе из приложения
  function clearChats() {
    setChats([]);
  }


  return {
    chats,
    loading,
    addChat,
    updateChat,
    clearChats
  }
}