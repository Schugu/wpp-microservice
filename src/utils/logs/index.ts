import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { getFormattedDate, getFormattedTime } from "../time";
import { BASE_DIR } from "../../config/dotenv.config";
import { ServiceError } from "./serviceError";
import { NODE_ENV } from "../../config/dotenv.config";

export const writeLog = ({
    prefixFile = "error",
    error,
    controllerName = ""
}: {
    prefixFile?: string;
    error?: unknown;
    controllerName?: string;
}) => {
    const logsDir = path.join(BASE_DIR, "logs");
    const logsFileName = `${prefixFile}_${getFormattedDate()}.txt`;
    const logsFilePath = path.join(logsDir, logsFileName);

    if (!existsSync(logsDir)) {
        mkdirSync(logsDir, { recursive: true });
    }

    let serviceName = "UNKNOWN_SERVICE";
    let serviceAction = "";
    let originalError = "Error desconocido";

    if (error instanceof ServiceError) {
        // Extrae el servicio: "GLOBAL_CONFIG_SERVICE: Error al..."
        const serviceMatch = error.message.match(/^([^:]+):/);
        serviceName = serviceMatch ? serviceMatch[1] : "UNKNOWN_SERVICE";

        // Extrae la acción: "Error al crear el usuario"
        const actionMatch = error.message.match(/Error al ([^.]+)\./);
        serviceAction = actionMatch ? `Error al ${actionMatch[1]}` : "Error en servicio";

        // Extrae el mensaje original del cause
        originalError = error.cause?.message || "Error no especificado";
    } else if (error instanceof Error) {
        originalError = error.message;
        serviceAction = "Error no capturado";
    }

    const logEntry = `[${getFormattedDate()} ${getFormattedTime()}] [${controllerName}] [${serviceName}] [${serviceAction}] ${originalError}\n\n`;

    if (existsSync(logsFilePath)) {
        const existing = readFileSync(logsFilePath, "utf-8");
        writeFileSync(logsFilePath, existing + logEntry);
    } else {
        writeFileSync(logsFilePath, logEntry);
    }

    if (NODE_ENV == "development"){
        console.log(logEntry);
    }
};