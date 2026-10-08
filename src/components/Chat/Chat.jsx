import './chat.css'
import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { formatTime } from '../../helpers/formatTime';
//Компонент для отображения чата
export function Chat({ api, chat, messages, onMessagesChange }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  //Отправляет сообщение через API и обновляет список сообщений
  async function send(e) {
    e?.preventDefault();
    const message = text.trim();

    if (!message || sending) return;

    setSending(true);
    try {
      const result = await api.sendMessage(chat.chatId, message);
      onMessagesChange([
        ...messages,
        {
          idMessage: result?.idMessage || crypto.randomUUID(),
          type: "outgoing",
          timestamp: Math.floor(Date.now() / 1000),
          textMessage: message,
        },
      ]);
      setText("");
    } catch (err) {
      alert(err.message || "Не удалось отправить сообщение");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="chat-window">
      <header className="chat-header">
        <div className="avatar">
          {(chat.name || "?").slice(0, 1).toUpperCase()}
        </div>
        <div>
          <strong>{chat.name || chat.username || chat.chatId}</strong>
          <div className="chat-subtitle">
            {chat.username || chat.phoneNumber || `ID: ${chat.chatId}`}
          </div>
        </div>
      </header>

      <div className="messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <h3>Начать общение</h3>
            <p>История сообщений появится здесь.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={`${message.idMessage}-${message.timestamp}`}
              className={`message-row ${message.type === "outgoing" ? "outgoing" : "incoming"}`}
            >
              <div className="message-bubble">
                <div className="message-text">{message.textMessage}</div>
                <div className="message-meta">
                  {formatTime(message.timestamp)}
                  {message.type === "outgoing" && "  ✓"}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form className="composer" onSubmit={send}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение..."
          maxLength={4096}
          disabled={sending}
        />
        <button
          className="send-btn"
          disabled={sending || !text.trim()}
          title="Отправить"
        >
          <Send size={19} />
        </button>
      </form>
    </section>
  );
}