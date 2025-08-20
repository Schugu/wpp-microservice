import { NextFunction, Request, Response } from "express";
import { whatsappService } from "@/config/whatsapp/instance";
import * as errors from "@/utils/errors";

export const controllerName = "CREATE_" + "SESSION" + "_DATA_CONTROLLER";

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { number } = req.params;
    if (!number) throw errors.whatsapp.session.unexpected;

    const wppModel = whatsappService.getWppModel();
    await wppModel.initClient(number);
    const result = wppModel.getQRCode(number);
    if (!result) throw errors.whatsapp.session.creationFailed;

    res.status(200).json({
      message: "Sesión creado exitosamente.",
      qr: result
    });
  } catch (error) { next(error) };
};
