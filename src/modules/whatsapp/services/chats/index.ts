export const getAll = async function (this: any, number: string) {
  const client = this.clients.get(number);
  if (!client) return { error: 'Cliente no inicializado.' };

  try {
    const chats = await client.getChats();
    const chatsWithPhotos = await Promise.all(
      chats.map(async (chat: any) => {
        const profilePhoto = await client.getProfilePicUrl(chat.id._serialized).catch(() => null);
        return { ...chat, profilePhoto: profilePhoto || null };
      })
    );
    return chatsWithPhotos;
  } catch (error) {
    return { error: 'Error al obtener los chats.' };
  }
};

export const get = async function (this: any, number: string, recipient: string) {
  const client = this.clients.get(number)
  if (!client) return { error: 'Cliente no inicializado.' }

  const chat = await client.getChatById(recipient + '@c.us')
  if (!chat) return { error: 'Chat no encontrado.' }

  return chat
};

export const getMessages = async function (this: any, number: string, recipient: string) {
  const client = this.clients.get(number);
  if (!client) return { error: 'Cliente no inicializado.' };

  const chatId = recipient.includes('-') ? recipient + '@g.us' : recipient + '@c.us';
  const chat = await client.getChatById(chatId);
  if (!chat) return { error: 'Chat no encontrado.' };

  return chat.fetchMessages({ limit: 100 });
};

export const archive = async function (this: any, number: string, recipient: string) {
  const client = this.clients.get(number);

  if (!client) return { error: 'Cliente no inicializado.' }

  try {
    const chatId = recipient.includes('-') ? `${recipient}@g.us` : `${recipient}@c.us`

    const chat = await client.getChatById(chatId)

    if (!chat) return { error: 'Chat no encontrado.' }

    if (chat.archived) return { success: true, message: 'El chat ya estaba archivado.' }

    const result = await client.archiveChat(chatId);

    if (result) {
      return { success: true, message: 'Chat archivado correctamente.' }
    } else {
      return { error: 'No se pudo archivar el chat.' }
    }
  } catch (error) {
    return { error: 'Error al archivar el chat.' }
  }
}

export const getProfilePhoto = async function (this: any, number: string, recipient: string) {
  const client = this.clients.get(number)

  if (!client) return { error: 'Cliente no inicializado.' }

  try {
    const chatId = recipient.includes('-') ? `${recipient}@g.us` : `${recipient}@c.us`

    const chat = await client.getChatById(chatId)

    if (!chat) return { error: 'Chat no encontrado.' };

    const result = await client.getProfilePicUrl(chatId);

    if (result) {
      return { success: true, ProfilePicUrl: result }
    } else {
      return { error: 'No se pudo obtener la foto de perfil.' }
    }
  } catch (error) {
    return { error: 'Error al obtener la foto de perfil.' }
  };
}
