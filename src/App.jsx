import { useCallback, useMemo, useState } from "react";
import { Login } from './components/Login/Login.jsx';
import { Chat } from './components/Chat/Chat.jsx'
import { Sidebar } from "./components/Sidebar/Sidebar.jsx";
import { Modal } from './components/Modal/Modal.jsx'
import { useChat } from "./hooks/useChat.js";
import { useChatMessages } from "./hooks/useChatMessages.js";
import { useNotification } from "./hooks/useNotification.js";
//Корневой компонент приложения, собирающий и отвечающий за управление приложением
function App() {
  const [session, setSession] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {chats, loading, addChat, updateChat, clearChats} = useChat(session)

  const {updateMessages, clearMessages, messagesByChat} = useChatMessages(session, activeChat)

  const handleMessage = useCallback((chatId, message) => {
    updateMessages(chatId, [
      ...(messagesByChat[chatId] || []),
      message
    ].sort((a, b) => a.timestamp - b.timestamp))
  }, [messagesByChat, updateMessages])

  const handleChatUpdate = useCallback((chatId, data) => {
    updateChat(chatId, data)
  }, [updateChat])

  useNotification({session, onMessage: handleMessage, onChatUpdate: handleChatUpdate})

  function logout() {
    setSession(null);
    setActiveChat(null);
    clearChats;
    clearMessages;
  }

  const activeMessages = useMemo(() => 
    (activeChat ? messagesByChat[activeChat.chatId] || [] : []),
    [activeChat, messagesByChat]
  );

  if (!session) {
    return <Login onLogin={setSession} />;
  }

  return (
    <main className="app-shell">
      <Sidebar
        chats={chats}
        activeChatId={activeChat?.chatId}
        onSelect={setActiveChat}
        onAdd={() => setModalOpen(true)}
        onLogout={logout}
      />

      {activeChat ? (
        <Chat
          api={session.api}
          chat={activeChat}
          messages={activeMessages}
          onMessagesChange={(next) =>
            updateMessages(activeChat.chatId, next)
          }
        />
      ) : (
        <section className="welcome">
          <h2>Green Messenger</h2>
          <p>Выбери чат слева или создай новый.</p>
          {loading && (
            <span className="muted">Загружаем чаты...</span>
          )}
        </section>
      )}

      {modalOpen && (
        <Modal
          api={session.api}
          onClose={() => setModalOpen(false)}
          onAdd={addChat}
        />
      )}
    </main>
  );
}

export default App;