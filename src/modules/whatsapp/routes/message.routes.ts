import express from "express";
import * as controller from "../controllers/messages";
import { validateParams, validateSchema } from "@/middlewares/validateSchema";
import { numberSchema } from "../schemas/number.schema";
import { messageSchema } from "../schemas/message.schema";

export const messageRoutes = express.Router();

messageRoutes.post("/:number", validateParams(numberSchema), validateSchema(messageSchema), controller.send);
