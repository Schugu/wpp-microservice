export class ServiceError extends Error {
  cause?: Error;

  constructor(serviceName: string, action: string, cause: unknown) {
    const message = cause instanceof Error ? cause.message : "Error desconocido";
    super(`${serviceName}: Error al ${action}. Detalle: ${message}`);
    this.name = "ServiceError";

    if (cause instanceof Error) {
      this.cause = cause;
      this.stack = cause.stack;
    }
  }
}