import { WhatsAppSession } from "@/config/whatsapp/session.config";
import pkg from 'whatsapp-web.js';
import mongoose from 'mongoose';
import { MongoStore } from 'wwebjs-mongo';
import qrcode from 'qrcode-terminal';
import { ServiceError } from "@/utils/logs/serviceError";

const { Client, RemoteAuth } = pkg;
const serviceName = `WHATSAPP_SESSION_SERVICE`;

export const initClient = async function (this: any, number: string) {
  if (this.clients.has(number)) {
    console.log(`El cliente ya existe para el número: ${number}`);
    return;
  }

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

  this.clients.set(number, client);

  client.on('qr', (qr) => {
    console.log(`🔹 QR para ${number}:`);
    qrcode.generate(qr, { small: true });
    this.qrCodes.set(number, qr);
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
      console.error('Error al guardar la sesión en la base de datos:', error);
    }
  });

  client.on('authenticated', () => {
    console.log(`Cliente de WhatsApp autenticado para el número: ${number}.`);
    this.isAuthenticated.set(number, true);
    this.qrCodes.delete(number);
  });

  // client.on('message', (message) => {
  //   console.log(`Nuevo mensaje de ${message.from}: ${message.body}`);
  // });

  client.on('ready', () => {
    console.log(`Cliente de WhatsApp listo para el número: ${number}.`);
  });

  client.on('auth_failure', () => {
    console.error(`Error de autenticación para el número: ${number}.`);
    this.isAuthenticated.set(number, false);
    this.qrCodes.delete(number);
  });

  // Solución: Usar arrow function para mantener el contexto de 'this'
  client.on('disconnected', async () => {
    console.log(`Cliente de WhatsApp desconectado para el número: ${number}.`);
    
    // Llamar directamente a cleanupClient como función exportada
    await cleanupClient.call(this, number);
  });

  try {
    await client.initialize();
  } catch (error) {
    this.clients.delete(number);
    this.qrCodes.delete(number);
    throw new ServiceError(serviceName, "inicializar cliente", error);
  }
};

export const cleanupClient = async function (this: any, number: string) {
  const client = this.clients.get(number);

  if (client) {
    try {
      await client.destroy();
      console.log(`Cliente de WhatsApp destruido para el número: ${number}.`);
    } catch (error) {
      console.error(`Error al destruir el cliente de WhatsApp para el número ${number}:`, error);
    }
  }

  // Limpiar mapas
  this.clients.delete(number);
  this.isAuthenticated.delete(number);
  this.qrCodes.delete(number);

  try {
    await WhatsAppSession.deleteOne({ clientId: number });
    console.log(`Sesión eliminada de la base de datos para el número: ${number}.`);
  } catch (error) {
    console.error(`Error al eliminar sesión de BD para ${number}:`, error);
  }
};

export const logout = async function (this: any, number: string) {
  try {
    const client = this.clients.get(number);

    if (!client) return false;

    await client.logout();
    await cleanupClient.call(this, number);
    console.log(`Sesión de WhatsApp eliminada para el número: ${number}.`);
    return true;
  } catch (error) {
    throw new ServiceError(serviceName, `cerrar sesión para ${number}`, error);
  }
};

export const restoreSessions = async function (this: any) {
  try {
    const sessions = await WhatsAppSession.find({});

    if (sessions.length === 0) {
      console.log('No hay sesiones para restaurar.');
      return null;
    }

    console.log(`Restaurando ${sessions.length} sesiones...`);
    const results = [];

    for (const session of sessions) {
      const { clientId } = session;
      try {
        await initClient.call(this, clientId);
        results.push({ clientId, success: true });
        console.log(`Sesión restaurada exitosamente para: ${clientId}`);
      } catch (error) {
        console.error(`Error al restaurar sesión para ${clientId}:`, error);
        results.push({ clientId, success: false });
      }
    }

    return results;
  } catch (error) {
    throw new ServiceError(serviceName, "restaurar sesiones", error);
  }
};

export const checkStatus = async function (this: any, number: string) {
  try {
    const client = this.clients.get(number);

    if (!client) return { status: 'DISCONNECTED', authenticated: false };

    const status = await client.getState();
    const authenticated = this.isAuthenticated.get(number) || false;

    return {
      status,
      authenticated,
    };
  } catch (error) {
    throw new ServiceError(serviceName, "chequear status", error);
  }
};

export const getQRCode = async function (this: any, number: string) {
  try {
    const qr = this.qrCodes.get(number);
    return qr || null;
  } catch (error) {
    throw new ServiceError(serviceName, "obtener QR", error);
  }
};

export const cleanExpiredQRCodes = function (this: any) {
  for (const [number] of this.qrCodes) {
    if (this.isAuthenticated.get(number)) {
      this.qrCodes.delete(number);
    }
  }
};