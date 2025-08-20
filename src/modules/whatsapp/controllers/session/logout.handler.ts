import { NextFunction, Request, Response } from "express";
import { whatsappService } from "@/config/whatsapp/instance";
import * as errors from "@/utils/errors";

export const controllerName = "LOGOUT" + "SESSION" + "_DATA_CONTROLLER";

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { number } = req.params;

    const wppModel = whatsappService.getWppModel();
    if (!wppModel) throw errors.whatsapp.service.notAvailable();

    const result = await wppModel.logout(number)
    if (!result) throw errors.whatsapp.session.unexpected;

    res.status(200).json({
      message: `Sesión de WhatsApp del número: ${number} cerrada.`
    });
  } catch (error) { next(error) };
};