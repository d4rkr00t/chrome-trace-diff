import crypto from "node:crypto";

export function getHash(input: string, size: number = 6): string {
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  return hash.substring(0, size);
}
