import './sidebar.css'
import { useState } from "react";
import { LogOut, Plus, Search } from "lucide-react";
import { formatTime } from '../../helpers/formatTime';
//Компонент списка контактов
export function Sidebar({ chats, activeChatId, onSelect, onAdd, onLogout }) {
  const [query, setQuery] = useState("");

  const filtered = chats.filter((chat) => {
    const haystack = `${chat.name || ""} ${chat.username || ""} ${chat.phoneNumber || ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <div className="avatar large">G</div>
        <div className="sidebar-title">
          <strong>Чаты</strong>
          <span>Telegram</span>
        </div>
        <button className="icon-btn" title="Новый чат" onClick={onAdd}>
          <Plus size={21} />
        </button>
        <button className="icon-btn" title="Выйти" onClick={onLogout}>
          <LogOut size={19} />
        </button>
      </header>

      <div className="search-box">
        <Search size={17} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск"
        />
      </div>

      <div className="chat-list">
        {filtered.length === 0 ? (
          <div className="empty-sidebar">
            <p>Чатов пока нет</p>
            <button className="link-btn" onClick={onAdd}>
              Создать первый чат
            </button>
          </div>
        ) : (
          filtered.map((chat) => (
            <button
              key={chat.chatId}
              className={`chat-item ${activeChatId === chat.chatId ? "active" : ""}`}
              onClick={() => onSelect(chat)}
            >
              <div className="avatar">
                {(chat.name || "?").slice(0, 1).toUpperCase()}
              </div>
              <div className="chat-item-content">
                <div className="chat-item-top">
                  <strong>{chat.name || chat.username || chat.chatId}</strong>
                  {chat.lastMessage && (
                    <span className="chat-time">{formatTime(chat.lastMessage.timestamp)}</span>
                  )}
                </div>
                <div className="chat-preview">
                  {chat.lastMessage?.text || chat.phoneNumber || chat.username || "Новый чат"}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}