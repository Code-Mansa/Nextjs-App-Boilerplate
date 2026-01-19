import crypto from "crypto";

export function generateOAuthPassword(googleId: string) {
  const secret = process.env.OAUTH_PASSWORD_SECRET!;

  // Step 1: strong deterministic hash
  const hash = crypto
    .createHmac("sha256", secret)
    .update(googleId)
    .digest("base64url"); // URL-safe

  // Step 2: force password policy
  const password =
    "P@" + // Uppercase + special
    hash.slice(0, 8) + // random-looking
    "9a?" + // number + lowercase + special
    hash.slice(8, 16);

  // Example output:
  // P@f3Klm82Q9a?xYpT

  return password;
}
