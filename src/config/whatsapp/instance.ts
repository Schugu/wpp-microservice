import { WppModel } from '../../modules/whatsapp/services/whatsapp.service'

// Singleton para manejar una única instancia del servicio de WhatsApp
class WhatsAppService {
  private static instance: WhatsAppService
  private wppModel: WppModel

  private constructor() {
    this.wppModel = new WppModel()
  }

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService()
    }
    return WhatsAppService.instance
  }

  public getWppModel(): WppModel {
    return this.wppModel
  }

  // Inicializar el servicio y restaurar sesiones
  public async initialize() {
    try {
      console.log('Inicializando servicio de WhatsApp...')
      await this.wppModel.restoreSessions()
      console.log('Servicio de WhatsApp inicializado correctamente.')
    } catch (error) {
      console.error('Error al inicializar el servicio de WhatsApp:', error)
    }
  }

  // Método para cerrar el servicio correctamente
  // public async shutdown() {
  //   try {
  //     console.log('Cerrando servicio de WhatsApp...')

  //     // Desconectar todos los clientes
  //     const clientNumbers = Array.from(this.wppModel.clients.keys())
  //     for (const number of clientNumbers) {
  //       await this.wppModel.logout(number)
  //     }

  //     // Desconectar Prisma
  //     await this.wppModel.disconnect()

  //     console.log('Servicio de WhatsApp cerrado correctamente.')
  //   } catch (error) {
  //     console.error('Error al cerrar el servicio de WhatsApp:', error)
  //   }
  // }
}

// Exportar la instancia única
export const whatsappService = WhatsAppService.getInstance();