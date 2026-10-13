const unsignedIntegerPattern = /^\d+$/;
const unsignedDecimalPattern = /^\d+(?:[.,]\d+)?$/;

export function sanitizeUnsignedIntegerInput(value: string) {
  return value.replace(/\D/g, "");
}

export function sanitizeUnsignedDecimalInput(value: string) {
  const allowedCharacters = value.replace(/[^\d.,]/g, "");
  const separatorIndex = allowedCharacters.search(/[.,]/);

  if (separatorIndex === -1) return allowedCharacters;

  return `${allowedCharacters.slice(0, separatorIndex + 1)}${allowedCharacters
    .slice(separatorIndex + 1)
    .replace(/[.,]/g, "")}`;
}

export function parseUnsignedInteger(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;

  const trimmedValue = value.trim();
  return unsignedIntegerPattern.test(trimmedValue)
    ? Number(trimmedValue)
    : Number.NaN;
}

export function parseUnsignedDecimal(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;

  const trimmedValue = value.trim();
  return unsignedDecimalPattern.test(trimmedValue)
    ? Number(trimmedValue.replace(",", "."))
    : Number.NaN;
}
