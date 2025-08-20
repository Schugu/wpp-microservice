import { AppError } from "@/utils/errors/appErrorMaker";
import { makeErrorSet } from "@/utils/errors/makeErrorSet";

export const service = makeErrorSet({
  name: "servico de WhatsApp",
  article: "el",
  articleIndef: "un",
  codePrefix: "WHATSAPP_SERVICE",
  customErrors: {
    notAvailable: () =>
      new AppError(
        "NOT_AVAILABLE",
        "El serivicio de WhatsApp no esta disponible.",
        400
      ),
  }
});