import express from "express";
import * as controller from "../controllers/session";

export const sessionRoutes = express.Router();

sessionRoutes.post("/:number", controller.create);
