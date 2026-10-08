export const DEFAULT_API_URL = "https://api.green-api.com";

//Функция для работы с GREEN-API
export function Api({ apiUrl = DEFAULT_API_URL, idInstance, apiTokenInstance }) {
  const base = apiUrl.replace(/\/+$/, "");
//Выполняет HTTP запросы к GREEN-API
  const url = (method, suffix = "") =>
    `${base}/waInstance${idInstance}/${method}/${apiTokenInstance}${suffix}`;

  async function request(method, options = {}) {
    const response = await fetch(url(method, options.suffix || ""), {
      method: options.httpMethod || "GET",
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    let data = null;
    const text = await response.text();

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      const reason =
        data?.reason ||
        data?.message ||
        data?.error ||
        `HTTP ${response.status}`;
      throw new Error(reason);
    }

    return data;
  }
//Получает состояние инстанса
  return {
    getStateInstance() {
      return request("getStateInstance");
    },
  //Получает чаты
    getChats() {
      return request("getChats");
    },
  //Получает историю чата, в данном случае 100 последних сообщений
    getChatHistory(chatId, count = 100) {
      return request("getChatHistory", {
        httpMethod: "POST",
        body: { chatId, count },
      });
    },
  //Проверяет наличие аккаунта по номеру телефона
    checkAccount(phoneNumber) {
      return request("checkAccount", {
        httpMethod: "POST",
        body: { phoneNumber: Number(phoneNumber) },
      });
    },
    //Отправляет сообщение
    sendMessage(chatId, message) {
      return request("sendMessage", {
        httpMethod: "POST",
        body: { chatId, message },
      });
    },
    //Отправляет уведомление о получении сообщения
    receiveNotification(receiveTimeout = 5) {
      return request("receiveNotification", {
        suffix: `?receiveTimeout=${receiveTimeout}`,
      });
    },
    //Удаляет уведомление из очереди
    deleteNotification(receiptId) {
      return request("deleteNotification", {
        httpMethod: "DELETE",
        suffix: `/${receiptId}`,
      });
    },
  };
}