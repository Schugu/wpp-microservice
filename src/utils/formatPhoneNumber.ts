export function formatPhoneNumberPlain(input: string): string {
  let cleaned = input.replace(/[\s\-\(\)]/g, "");

  cleaned = cleaned.replace(/^\+/, "");

  cleaned = cleaned.replace(/^00/, "");

  return cleaned;
}
