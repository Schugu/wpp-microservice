import { CORS_ORIGIN } from "./dotenv.config";

const optionCors = {
  origin: CORS_ORIGIN,
  methods: "GET,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders: [
    "Access-Control-Allow-Origin",
    "Content-Type",
    "Authorization",
  ],
};

export { optionCors };