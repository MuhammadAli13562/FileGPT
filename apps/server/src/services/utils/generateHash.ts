const { createHash } = require("node:crypto");

export default function generateHash(str1: string, str2: string) {
  const passwordhash = createHash("sha256")
    .update(str1 + str2)
    .digest("hex");
  return passwordhash;
}
