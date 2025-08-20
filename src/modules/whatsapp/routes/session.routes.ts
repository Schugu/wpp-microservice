import express from "express";
import * as controller from "../controllers/session";
import { validateParams } from "@/middlewares/validateSchema";
import { numberSchema } from "../schemas/number.schema";

export const sessionRoutes = express.Router();

sessionRoutes.post("/:number", validateParams(numberSchema), controller.create);
sessionRoutes.get('/status/:number', validateParams(numberSchema), controller.checkStatus)
sessionRoutes.get('/logout/:number', validateParams(numberSchema), controller.logout)
