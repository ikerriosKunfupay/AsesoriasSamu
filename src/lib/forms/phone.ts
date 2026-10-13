export const PHONE_PREFIXES = [
  { value: "+34", label: "ES +34" },
  { value: "+351", label: "PT +351" },
  { value: "+33", label: "FR +33" },
  { value: "+44", label: "UK +44" },
  { value: "+49", label: "DE +49" },
  { value: "+39", label: "IT +39" },
] as const;

const DEFAULT_PHONE_PREFIX = PHONE_PREFIXES[0].value;

export function splitPhoneValue(value: string) {
  const normalizedValue = value.trim();
  const matchingPrefix = [...PHONE_PREFIXES]
    .sort((left, right) => right.value.length - left.value.length)
    .find(({ value: prefix }) => (
      normalizedValue === prefix
      || normalizedValue.startsWith(`${prefix} `)
      || normalizedValue.startsWith(prefix)
    ));

  if (!matchingPrefix) {
    return { prefix: DEFAULT_PHONE_PREFIX, phoneNumber: normalizedValue };
  }

  return {
    prefix: matchingPrefix.value,
    phoneNumber: normalizedValue.slice(matchingPrefix.value.length).trim(),
  };
}

export function formatPhoneValue(prefix: string, phoneNumber: string) {
  const normalizedNumber = phoneNumber.trim();
  if (!normalizedNumber) return "";
  if (normalizedNumber.startsWith("+")) return normalizedNumber;
  return `${prefix} ${normalizedNumber}`;
}

export function formatStoredPhoneValue(value: string) {
  const { prefix, phoneNumber } = splitPhoneValue(value);
  return formatPhoneValue(prefix, phoneNumber);
}
