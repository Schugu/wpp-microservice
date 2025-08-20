import { Request, Response, NextFunction } from "express";
import { z, ZodObject, ZodError } from "zod";

export const validateSchema =
  (schema: ZodObject<any>) =>
    (req: Request, res: Response, next: NextFunction): void => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({
            errors: error.errors.map((err) => ({
              path: err.path,
              message: err.message,
            })),
          });
        } else {
          next(error);
        }
      }
    };

export const validateSchemaPartial =
  (schema: ZodObject<any>) =>
    (req: Request, res: Response, next: NextFunction): void => {
      const partialSchema = schema.partial().refine(
        (data) => Object.keys(data).length > 0,
        { message: "Debe enviar al menos un campo." }
      );

      try {
        req.body = partialSchema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({
            errors: error.errors.map((err) => ({
              path: err.path,
              message: err.message,
            })),
          });
        } else {
          next(error);
        }
      }
    };

export const validateParams =
  (schema: ZodObject<any>) =>
    (req: Request, res: Response, next: NextFunction): void => {
      try {
        req.params = schema.parse(req.params); 
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({
            errors: error.errors.map((err) => ({
              path: err.path,
              message: err.message,
            })),
          });
        } else {
          next(error);
        }
      }
    };