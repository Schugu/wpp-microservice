import { Response } from "express";

export const handleErrorResponse = (res: Response, status: number, message: string) => {
  res.status(status).json({ message });
};