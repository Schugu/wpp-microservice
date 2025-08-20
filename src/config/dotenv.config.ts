import dotenv from "dotenv";
import { validateEnv } from "../utils/validateEnv";

dotenv.config();

export const PORT = parseInt(process.env.PORT ?? "8080", 10);
export const HOST = process.env.HOST ?? "localhost";
export const CORS_ORIGIN = validateEnv("CORS_ORIGIN", process.env.CORS_ORIGIN);
export const BASE_DIR = validateEnv("BASE_DIR", process.env.BASE_DIR);
export const NODE_ENV = validateEnv('NODE_ENV', process.env.NODE_ENV);
export const MONGODB_URI = validateEnv('MONGODB_URI', process.env.MONGODB_URI);
