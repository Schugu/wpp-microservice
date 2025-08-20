export const validateEnv = (key: string, value: string | undefined): string => {
  if (!value) throw new Error(`La variable de entorno "${key}" no está definida.`);
  return value;
};
