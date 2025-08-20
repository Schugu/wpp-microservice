import { z } from "zod";
import * as validator from "@/utils/validators";
import { formatPhoneNumberPlain } from "@/utils/formatPhoneNumber";

export const numberSchema = z.object({
  number: z.string({
    required_error: "El número es requerido.",
    invalid_type_error: "El número debe ser un string."
  })
    .transform((val) => formatPhoneNumberPlain(val)) 
    .refine((val) => /^\d{8,15}$/.test(val), { 
      message: "El número debe contener solo dígitos y tener entre 8 y 15 caracteres.",
    }),
}).strict();
