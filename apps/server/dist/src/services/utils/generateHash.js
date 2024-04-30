"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { createHash } = require("node:crypto");
function generateHash(str1, str2) {
    const passwordhash = createHash("sha256")
        .update(str1 + str2)
        .digest("hex");
    return passwordhash;
}
exports.default = generateHash;
