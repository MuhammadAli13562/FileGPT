"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const AuthService_1 = require("../services/DB/AuthService");
const useJwtToken_1 = require("../services/utils/useJwtToken");
const AuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.headers;
        if (!token)
            throw new Error("Token is missing");
        const { email, passwordHash } = (0, useJwtToken_1.decodeJwtToken)(token);
        yield (0, AuthService_1.DB_verifyUser)({ email, passwordHash });
        res.set("email", email);
        next();
    }
    catch (error) {
        console.log("authmid : ", error.message);
        res.status(401).send({ message: error.message });
    }
});
exports.AuthMiddleware = AuthMiddleware;
