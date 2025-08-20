import { ServiceError } from "@/utils/logs/serviceError";

export const send = async function (this: any, number: string, recipient: string, message: string) {
  const client = this.clients.get(number)

  try {
    if (!client) throw Error(`cliente no iniciado para el numero ${number}`);

    if (!this.isAuthenticated.get(number)) {
      throw Error(`cliente no aunteticado. Solicita autenticación`)
    };

    const chatId = `${recipient}@c.us`;

    const result = await client.sendMessage(chatId, message);

    return result || null;
  } catch (error) {
    throw new ServiceError("WHATSAPP_MESSAGE_SERVICE", "Error al enviar mensaje", error);
  }
};