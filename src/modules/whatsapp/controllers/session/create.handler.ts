import { NextFunction, Request, Response } from "express";
import { whatsappService } from "@/config/whatsapp/instance";
import * as errors from "@/utils/errors";

export const controllerName = "CREATE_" + "SESSION" + "_DATA_CONTROLLER";

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { number } = req.params;

    const wppModel = whatsappService.getWppModel();
    if (!wppModel) throw errors.whatsapp.service.notAvailable();

    const existingStatus = await wppModel.checkStatus(number);

    if (existingStatus?.status === 'CONNECTED' || existingStatus?.authenticated) {
      res.status(409).json({
        success: false,
        message: "Ya existe una sesión activa para este número.",
        data: {
          number,
          status: existingStatus.status,
          authenticated: existingStatus.authenticated
        }
      });
    } else {
      await wppModel.initClient(number);
      const result = wppModel.getQRCode(number);
      if (!result) throw errors.whatsapp.session.creationFailed;

      res.status(200).json({
        message: "Sesión creado exitosamente.",
        qr: result
      });
    };
  } catch (error) { next(error) };
};
