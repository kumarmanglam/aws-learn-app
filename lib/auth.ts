import "server-only";

import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession, type SessionPayload } from "./session";

/**
 * Resolve the current signed-in user from the Next.js cookie store.
 * Returns null when the cookie is absent or fails verification.
 */
export async function getCurrentUser(): Promise<SessionPayload | null> {
  const jar = cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  return verifySession(token);
}
