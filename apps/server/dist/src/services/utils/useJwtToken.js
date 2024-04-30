"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJwtToken = exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET;
function generateJwtToken({ email, passwordHash }) {
    return jsonwebtoken_1.default.sign({ email, passwordHash }, secret);
}
exports.generateJwtToken = generateJwtToken;
function decodeJwtToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        throw Error("UnAuthorized");
    }
}
exports.decodeJwtToken = decodeJwtToken;
