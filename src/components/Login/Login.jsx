import './login.css'
import { useState } from 'react';
import { Api, DEFAULT_API_URL } from "../../api/api.js";
//Компонент формы авторизации
export function Login({ onLogin }) {
  const [idInstance, setIdInstance] = useState("");
  const [token, setToken] = useState("");
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!idInstance.trim() || !token.trim()) {
      setError("Заполни ID Instance и API Token Instance");
      return;
    }

    setLoading(true);

    try {
      const api = Api({
        apiUrl,
        idInstance: idInstance.trim(),
        apiTokenInstance: token.trim(),
      });

      const state = await api.getStateInstance();

      if (state?.stateInstance !== "authorized") {
        throw new Error(
          `Инстанс не авторизован. Текущее состояние: ${state?.stateInstance || "unknown"}`
        );
      }

      onLogin({
        api,
        credentials: {
          apiUrl: apiUrl.trim(),
          idInstance: idInstance.trim(),
          apiTokenInstance: token.trim(),
        },
      });
    } catch (err) {
      setError(err.message || "Не удалось подключиться к GREEN-API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Messenger</h1>
        <p className="muted">
          Telegram-клиент на GREEN-API
        </p>

        <label>
          API URL
          <input
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://api.green-api.com"
          />
        </label>

        <label>
          ID Instance
          <input
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            placeholder="1101..."
            autoComplete="off"
          />
        </label>

        <label>
          API Token Instance
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="••••••••••••"
            type="password"
            autoComplete="off"
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button className="primary-btn" disabled={loading}>
          {loading ? "Подключаемся..." : "Войти"}
        </button>

        <p className="tiny">
          Токен используется только в текущей вкладке и не сохраняется в состоянии, обновляйте страницу осторожно.
        </p>
      </form>
    </main>
  );
}