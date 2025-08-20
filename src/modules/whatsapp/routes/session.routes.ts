import express from "express";
import * as controller from "../controllers/session";
export const sessionRoutes = express.Router();
import { validateParams } from "@/middlewares/validateSchema";
import { numberSchema } from "../schemas/number.schema";

sessionRoutes.post("/:number", validateParams(numberSchema), controller.create);
sessionRoutes.get('/status/:number', validateParams(numberSchema), controller.checkStatus)
sessionRoutes.get('/logout/:number', validateParams(numberSchema), controller.logout)
