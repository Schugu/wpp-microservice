import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors/appErrorMaker';
import { handleErrorResponse } from '../utils/handleErrorResponse';
import { writeLog } from '../utils/logs';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const routeInfo = {
    method: req.method,
    path: req.route?.path || req.originalUrl || 'UNKNOWN_ROUTE',
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  };

  if (!(error instanceof AppError)) {
    // Solo loguear errores no controlados como error grave
    writeLog({ controllerName: `${req.method}_${routeInfo.path}_CONTROLLER`, error });
  } else {
    // Opcional: loguear errores controlados como info o no loguear nada
    // writeLog({ controllerName: `${req.method}_${routeInfo.path}_CONTROLLER`, error });
  }

  if (error instanceof AppError) {
    return handleErrorResponse(res, error.statusCode, error.message);
  }

  if (error.name === 'ValidationError') {
    return handleErrorResponse(res, 400, 'Datos de entrada inválidos.');
  }

  if (error.name === 'PrismaClientKnownRequestError') {
    return handleErrorResponse(res, 500, 'Error en la base de datos.');
  }

  return handleErrorResponse(res, 500, "Error interno del servidor.");
};
