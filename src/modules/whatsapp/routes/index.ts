import express from "express";
import { sessionRoutes } from "./session.routes";
import { messageRoutes } from "./message.routes";

export const whatsappRoutes = express.Router();

whatsappRoutes.use("/sessions", sessionRoutes);
whatsappRoutes.use("/messages", messageRoutes);
