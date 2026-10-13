export function leadReference(id: string) {
  return id.replaceAll("-", "").slice(0, 8).toUpperCase();
}
