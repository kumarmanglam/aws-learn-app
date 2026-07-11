import "server-only";

import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "SAA_SESSION";
const ALG = "HS256";
const ISSUER = "saa-learning-app";
const AUDIENCE = "saa-learning-app";
const MAX_AGE_DAYS = 30;

// Built-in fallback so the app works out-of-the-box without a .env.local.
// Override with SESSION_SECRET in production (openssl rand -hex 32).
const DEFAULT_SECRET = "saa-learning-app-default-session-secret-change-me";

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) {
    return new TextEncoder().encode(secret);
  }
  return new TextEncoder().encode(DEFAULT_SECRET);
}

export type SessionPayload = {
  username: string;
  displayName: string;
};

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_DAYS}d`)
    .sign(getSecret());
}

export async function verifySession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    const username = payload.username;
    const displayName = payload.displayName;
    if (typeof username !== "string" || typeof displayName !== "string") {
      return null;
    }
    return { username, displayName };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE_SECONDS = MAX_AGE_DAYS * 24 * 60 * 60;
