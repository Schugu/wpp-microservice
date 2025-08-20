import { z } from "zod";

export const string = (minLength?: number, maxLength?: number) => {
  let schema = z.string({
    invalid_type_error: "El campo debe ser de tipo string.",
    required_error: "Este campo es requerido."
  }).trim();

  if (minLength !== undefined) {
    schema = schema.min(minLength, {
      message: `Debe tener al menos ${minLength} caracteres.`,
    });
  }

  if (maxLength !== undefined) {
    schema = schema.max(maxLength, {
      message: `No puede tener más de ${maxLength} caracteres.`,
    });
  }

  return schema;
};