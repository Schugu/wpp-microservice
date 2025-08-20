import { makeErrorSet } from "@/utils/errors/makeErrorSet";

export const session = makeErrorSet({
  name: "sesión",
  article: "la",
  articleIndef: "una",
  codePrefix: "SESSION",
});