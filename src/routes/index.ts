import { Router } from "express";
import { whatsappRoutes } from "../modules/whatsapp/routes";

export const mainRoutes = Router();

mainRoutes.use("/whatsapp", whatsappRoutes);