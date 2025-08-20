import { WhatsAppSession } from "@/config/whatsapp/session.config";
import pkg from 'whatsapp-web.js';
import mongoose from 'mongoose';
import { MongoStore } from 'wwebjs-mongo';
import qrcode from 'qrcode-terminal';


const { Client, RemoteAuth } = pkg;

export const initClient = async function (this: any, number: string) {
 const store = new MongoStore({ mongoose });

    const client = new Client({
      authStrategy: new RemoteAuth({
        store,
        backupSyncIntervalMs: 300000,
        clientId: number,
      }),
      qrMaxRetries: 3,
      puppeteer: { headless: true },
    });

    // Guardar el cliente en el objeto `clients`
    this.clients.set(number, client);

    client.on('qr', (qr) => {
      console.log(`🔹 QR para ${number}:`);
      qrcode.generate(qr, { small: true })
      this.qrCodes.set(number, qr); // Guardar QR para que getQRCode lo devuelva
    });

    client.on('remote_session_saved', async () => {
      console.log(`Sesión guardada en la base de datos para el número: ${number}.`);

      const sessionData = {};

      try {
        await WhatsAppSession.findOneAndUpdate(
          { clientId: number },
          { $set: { sessionData } },
          { upsert: true }
        );
      } catch (error) {
        console.log('Error al guardar la sessión en la base de datos.')
      };
    });

    client.on('authenticated', () => {
      console.log(`Cliente de WhatsApp autenticado para el número: ${number}.`);
      this.isAuthenticated.set(number, true);
    });

    // Desactivar esto desp
    client.on('message', (message) => {
      console.log(`Nuevo mensaje de ${message.from}: ${message.body}`);
      // const formattedMessage = {
      //   from: message.from,
      //   body: message.body,
      //   to: message.to,
      //   timestamp: message.timestamp,
      // }
    });

    client.on('ready', () => {
      console.log(`Cliente de WhatsApp listo para el número: ${number}.`);
    });

    client.on('auth_failure', () => {
      console.error(`Error de autenticación para el número: ${number}.`);
      this.isAuthenticated.set(number, false);
    });

    client.on('disconnected', async () => {
      console.log(`Cliente de WhatsApp desconectado para el número: ${number}.`);

      try {
        await client.destroy();
        console.log(`Cliente de WhatsApp destruido para el número: ${number}.`);
      } catch (error) {
        console.error(`Error al destruir el cliente de WhatsApp para el número ${number}:`, error)
      };

      this.clients.delete(number);
      this.isAuthenticated.delete(number);

      try {
        await WhatsAppSession.deleteOne({ clientId: number });
        console.log(`Sesión eliminada de la base de datos para el número: ${number}.`);
      } catch (error) {
        console.error(
          `Error al eliminar la sesión de la base de datos para el número ${number}:`,
          error
        );
      };
    })

    await client.initialize();
};

export const logout = async function (this: any, number: string) {
  console.log(number);
  const client = this.clients.get(number);

  if (!client) {
    console.error(`Cliente no inicializado para el número ${number}.`);
    return false;
  };

  try {
    await client.logout();
    await client.destroy();
    this.clients.delete(number);
    this.isAuthenticated.delete(number);

    await WhatsAppSession.deleteOne({ clientId: number });
    console.log(`Sesión de WhatsApp eliminada para el número: ${number}.`);

    return true;
  } catch (error) {
    console.error(`Error al cerrar la sesión para el número ${number}:`, error);
    return false;
  };
};

export const restoreSessions = async function (this: any) {
  const sessions = await WhatsAppSession.find({});
  if (sessions.length === 0) {
    console.log('No se encontraron sesiones para restaurar.');
    return [];
  };

  for (const session of sessions) {
    const { clientId } = session;
    try {
      await this.initClient(clientId);
      console.log(`Sesión con el id: ${clientId} restaurada.`);
    } catch (error) {
      console.error(`Error al inicializar el cliente para el ID ${clientId}:`, error);
    };
  };

  return true;
};

export const checkStatus = async function (this: any, number: string) {
  const client = this.clients.get(number);
  if (!client) return { status: 'DISCONNECT' };
  const status = await client.getState();
  return { status };
};

export const getQRCode = async function (this: any, number: string) {
  const qr = this.qrCodes.get(number);
  return qr ? qr : null;
};
