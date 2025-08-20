import express from "express";
import { sessionRoutes } from "./session.routes";

export const whatsappRoutes = express.Router();

whatsappRoutes.use("/sessions", sessionRoutes);
