import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type AccountChangeKind = "email" | "password";

type TokenPayload = {
  expiresAt: number;
  kind: AccountChangeKind;
  nonce: string;
  userId: string;
  version: 1;
};

const TOKEN_LIFETIME_SECONDS = 10 * 60;

function tokenSecret() {
  const secret = process.env.ACCOUNT_CHANGE_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Falta el secreto del flujo de seguridad de la cuenta.");
  return secret;
}

function signature(payload: string) {
  return createHmac("sha256", tokenSecret()).update(payload).digest("base64url");
}

export function accountChangeCookieName(kind: AccountChangeKind) {
  return `team-ortega-${kind}-change`;
}

export function createAccountChangeToken(
  userId: string,
  kind: AccountChangeKind,
  now = Date.now(),
) {
  const payload: TokenPayload = {
    expiresAt: Math.floor(now / 1000) + TOKEN_LIFETIME_SECONDS,
    kind,
    nonce: randomBytes(18).toString("base64url"),
    userId,
    version: 1,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${signature(encodedPayload)}`;
}

export function verifyAccountChangeToken(
  token: string | undefined,
  expectedKind: AccountChangeKind,
  expectedUserId: string,
  now = Date.now(),
) {
  if (!token) return false;
  const [encodedPayload, receivedSignature, extra] = token.split(".");
  if (!encodedPayload || !receivedSignature || extra) return false;

  const expectedSignature = signature(encodedPayload);
  const receivedBuffer = Buffer.from(receivedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<TokenPayload>;
    return (
      payload.version === 1 &&
      payload.kind === expectedKind &&
      payload.userId === expectedUserId &&
      typeof payload.nonce === "string" &&
      payload.nonce.length > 0 &&
      typeof payload.expiresAt === "number" &&
      payload.expiresAt >= Math.floor(now / 1000)
    );
  } catch {
    return false;
  }
}
