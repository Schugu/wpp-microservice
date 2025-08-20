import { NextFunction, Request, Response } from "express";
import { whatsappService } from "@/config/whatsapp/instance";
import * as errors from "@/utils/errors";

export const controllerName = "CHECK_STATUS" + "SESSION" + "_DATA_CONTROLLER";

export const checkStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { number } = req.params;

    const wppModel = whatsappService.getWppModel();
    if (!wppModel) throw errors.whatsapp.service.notAvailable();

    const result = await wppModel.checkStatus(number)
    if (!result) throw errors.whatsapp.session.unexpected;

    res.status(200).json({ number, result });
  } catch (error) { next(error) };
};