import "server-only";

import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "SAA_SESSION";
const ALG = "HS256";
const ISSUER = "saa-learning-app";
const AUDIENCE = "saa-learning-app";
const MAX_AGE_DAYS = 30;

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or too short (need 32+ chars). " +
        "Set it in .env.local; generate with: openssl rand -hex 32"
    );
  }
  return new TextEncoder().encode(secret);
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
