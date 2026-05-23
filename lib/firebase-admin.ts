// ============================================================
// Firebase Admin SDK singleton — server-side only
//
// Reads service-account credentials from environment variables
// (see .env.local.example). Initialised exactly once per Node
// process and re-used across API routes.
//
// IMPORTANT: never import this module from a client component.
// ============================================================
import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function buildApp(): App {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // The private key arrives with literal "\n" sequences inside the env var.
  // Convert them back into real newlines before handing to cert().
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, " +
        "FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    projectId,
  });
}

const app = getApps()[0] ?? buildApp();

export const db: Firestore = getFirestore(app);
