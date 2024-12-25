import { initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import path from "path";

export const firebase = async () => {
  const serviceAccount = await import(
    path.resolve(process.cwd(), "credentials/epen_credentials.json")
  );
  return initializeApp({
    credential: credential.cert(serviceAccount),
  });
};
