import { z } from "zod";
import * as validator from "@/utils/validators";

export const numberSchema = z.object({
  number: validator.string(8,15),
}).strict();
