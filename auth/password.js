import crypto from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);
const KEY_LENGTH = 64;

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, KEY_LENGTH);
  return { salt, passwordHash: key.toString("hex") };
}

// Ken Yong Code Review: I am impress on your security thoughts on this project
// which using crypto.timingSafeEqual() when comparing password hashes.
// This is not only avoids using a normal string comparison
// but also helps protect the password verification process from timing attacks!

export async function verifyPassword(password, salt, passwordHash) {
  const key = await scrypt(password, salt, KEY_LENGTH);
  const stored = Buffer.from(passwordHash, "hex");
  return stored.length === key.length && crypto.timingSafeEqual(stored, key);
}
