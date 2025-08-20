import * as chats from "./chats";
import * as messages from "./messages";
import * as sessions from "./sessions";


export class WppModel {
  clients: Map<string, any>;
  isAuthenticated: Map<string, boolean>;
  qrCodes = new Map<string, string>();

  constructor() {
    this.clients = new Map()
    this.isAuthenticated = new Map()
  };

  // Sessions
  initClient = sessions.initClient;
  getQRCode = sessions.getQRCode;
  logout = sessions.logout;
  restoreSessions = sessions.restoreSessions;
  checkStatus = sessions.checkStatus;

  // Chats
  getChats = chats.getAll;
  getChat = chats.get;
  getMessages = chats.getMessages;
  archiveChat = chats.archive;

  // Mensajes
  sendMessage = messages.send;
}
