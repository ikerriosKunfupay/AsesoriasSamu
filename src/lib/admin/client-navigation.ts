const CLIENT_RETURN_DESTINATIONS = {
  "/admin": "Volver al resumen",
  "/admin/clientes": "Volver a clientes",
  "/admin/entrenamientos": "Volver a entrenamientos",
  "/admin/nutricion": "Volver a nutrición",
  "/admin/seguimientos": "Volver a seguimientos",
} as const;

export type ClientReturnPath = keyof typeof CLIENT_RETURN_DESTINATIONS;

const DEFAULT_CLIENT_RETURN_PATH: ClientReturnPath = "/admin/clientes";

export function getClientReturnDestination(value: string | string[] | undefined) {
  const requestedPath = Array.isArray(value) ? value[0] : value;
  const path =
    requestedPath && Object.prototype.hasOwnProperty.call(CLIENT_RETURN_DESTINATIONS, requestedPath)
      ? (requestedPath as ClientReturnPath)
      : DEFAULT_CLIENT_RETURN_PATH;

  return {
    href: path,
    label: CLIENT_RETURN_DESTINATIONS[path],
  };
}

export function getClientDetailHref(
  clientId: string,
  returnTo: ClientReturnPath,
  hash?: "cuestionario",
) {
  const query = new URLSearchParams({ returnTo }).toString();
  const fragment = hash ? `#${hash}` : "";

  return `/admin/clientes/${encodeURIComponent(clientId)}?${query}${fragment}`;
}
