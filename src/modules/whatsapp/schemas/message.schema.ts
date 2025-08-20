import { z } from "zod";
import * as validator from "@/utils/validators";
import { numberSchema } from "./number.schema";

export const messageSchema = z.object({
  recipient: numberSchema.shape.number,
  message: validator.string(4, 255),
}).strict();