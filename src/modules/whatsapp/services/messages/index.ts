export const send = async function (this: any, number: string, recipient: string, message: string) {
  const client = this.clients.get(number)

  try {
    if (!client) throw Error(`cliente no iniciado para el numero ${number}`);

    if (!this.isAuthenticated.get(number)) {
      throw Error(`cliente no aunteticado. Solicita autenticación`)
    };

    const chatId = `${recipient}@c.us`;
    await client.sendMessage(chatId, message);
  } catch (error: any) {
    console.error('Error al enviar mensaje:', error);
  }
};