import { AppError } from "./appErrorMaker";

type StandardErrors = {
  alreadyExists: (fieldObj: Record<string, string>) => AppError;
  notFound: (fieldObj: Record<string, string>) => AppError;
  creationFailed: () => AppError;
  deleteFailed: () => AppError;
  editFailed: () => AppError;
  filterFailed: () => AppError;
  unexpected: () => AppError;
  custom: (code: string, message: string, status: number) => AppError;
};

type EntityErrorOptions<TCustomErrors extends Record<string, (...args: any[]) => AppError> = {}> = {
  name: string;
  article: "el" | "la";
  articleIndef: "un" | "una";
  codePrefix: string;
  customErrors?: TCustomErrors;
};

export function makeErrorSet<TCustomErrors extends Record<string, (...args: any[]) => AppError> = {}>(
  {
    name,
    article,
    articleIndef,
    codePrefix,
    customErrors = {} as TCustomErrors,
  }: EntityErrorOptions<TCustomErrors>
): StandardErrors & TCustomErrors {
  const capitalizedArticle = article.charAt(0).toUpperCase() + article.slice(1);

  const standardErrors: StandardErrors = {
    alreadyExists: (fieldObj) => {
      const [[field, value]] = Object.entries(fieldObj);
      return new AppError(
        `${codePrefix}_ALREADY_EXISTS`,
        `${capitalizedArticle} ${name} con el ${field}: ${value} ya existe.`,
        409
      );
    },

    notFound: (fieldObj) => {
      const [[field, value]] = Object.entries(fieldObj);
      return new AppError(
        `${codePrefix}_NOT_FOUND`,
        `No se encontró ${articleIndef} ${name} con el ${field}: ${value}.`,
        404
      );
    },

    creationFailed: () =>
      new AppError(
        `${codePrefix}_CREATION_FAILED`,
        `Ocurrió un error al crear ${articleIndef} ${name}.`,
        500
      ),

    deleteFailed: () =>
      new AppError(
        `${codePrefix}_DELETE_FAILED`,
        `Ocurrió un error al eliminar ${articleIndef} ${name}.`,
        500
      ),

    editFailed: () =>
      new AppError(
        `${codePrefix}_EDIT_FAILED`,
        `Ocurrió un error al editar ${articleIndef} ${name}.`,
        500
      ),

    filterFailed: () =>
      new AppError(
        `${codePrefix}_FILTER_FAILED`,
        `No se encontraron resultados con los filtros aplicados a ${articleIndef} ${name}.`,
        400
      ),

    unexpected: () =>
      new AppError(
        `${codePrefix}_UNEXPECTED_ERROR`,
        `Ocurrió un error inesperado al procesar ${articleIndef} ${name}.`,
        500
      ),

    custom: (code, message, status) =>
      new AppError(`${codePrefix}_${code}`, message, status),
  };

  return {
    ...standardErrors,
    ...customErrors,
  };
}
