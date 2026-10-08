import './modal.css'
import { useState } from "react";
import { X } from "lucide-react";
//Компонент для создания модального окна
export function Modal({ api, onClose, onAdd }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    const phone = value.replace(/\D/g, "");
    if (!phone) {
      setError("Введи номер в международном формате, например 7123456789");
      return;
    }

    setLoading(true);
    try {
      const result = await api.checkAccount(phone);

      if (!result?.exist || !result?.chatId) {
        throw new Error(
          "Telegram-аккаунт не найден. Проверь номер или настройки приватности."
        );
      }

      onAdd({
        chatId: result.chatId,
        name: result.username || phone,
        phoneNumber: result.phoneNumber || Number(phone),
        username: result.username || "",
        type: "user",
      });
      onClose();
    } catch (err) {
      setError(err.message || "Не удалось найти аккаунт");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form className="modal" onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Новый чат</h2>
            <p className="muted">Найдем Telegram по номеру телефона</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <label>
          Номер телефона
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="79991234567"
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button className="primary-btn" disabled={loading}>
          {loading ? "Ищем..." : "Создать чат"}
        </button>
      </form>
    </div>
  );
}