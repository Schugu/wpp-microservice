import { AppError } from "@/utils/errors/appErrorMaker";
import { makeErrorSet } from "@/utils/errors/makeErrorSet";

export const message = makeErrorSet({
  name: "mensaje",
  article: "el",
  articleIndef: "un",
  codePrefix: "MESSAGE",
  customErrors: {
    messageNotSent: () =>
      new AppError(
        "MESSAGE_NOT_SENT",
        "El mensaje no se pudo enviar.",
        400
      )

  }
});