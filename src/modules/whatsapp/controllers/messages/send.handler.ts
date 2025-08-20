import { NextFunction, Request, Response } from "express";
import { whatsappService } from "@/config/whatsapp/instance";
import * as errors from "@/utils/errors";

export const controllerName = "SEND_" + "MESSAGE" + "_DATA_CONTROLLER";

export const send = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { number } = req.params;
    const { recipient, message } = req.body;

    const wppModel = whatsappService.getWppModel();
    if (!wppModel) throw errors.whatsapp.service.notAvailable();

    const result = await wppModel.sendMessage(number, recipient, message);
    if (!result) throw errors.whatsapp.message.messageNotSent();

    res.status(200).json({
      message: 'Mensaje enviado con éxito',
      to: result.to,
      from: result.from,
      body: result.body
    });
  } catch (error) { next(error) };
};
