//Функция, приводящая сообщения по порядку
export function orderMessages(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item) => item?.typeMessage === "textMessage" || item?.textMessage)
    .map((item) => ({
      idMessage: item.idMessage,
      type: item.type,
      timestamp: item.timestamp,
      textMessage:
        item.textMessage ||
        item.textMessageData?.textMessage ||
        "",
    }))
    .filter((item) => item.textMessage)
    .sort((a, b) => a.timestamp - b.timestamp);
}