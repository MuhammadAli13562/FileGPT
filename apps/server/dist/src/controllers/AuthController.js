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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthService_1 = require("../services/DB/AuthService");
const client_1 = require("@prisma/client");
const useJwtToken_1 = require("../services/utils/useJwtToken");
const generateHash_1 = __importDefault(require("../services/utils/generateHash"));
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
function AuthController() {
    const router = (0, express_1.Router)();
    router.post("/register", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { email, name, password } = req.body;
        try {
            if (!email || !name || !password)
                throw Error("Incomplete Information");
            const passwordHash = (0, generateHash_1.default)(email, password);
            const user = yield (0, AuthService_1.DB_createUser)({ email, name, passwordHash });
            const token = (0, useJwtToken_1.generateJwtToken)({ email, passwordHash });
            res.set("token", token);
            res.status(200).send({ user });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P1001")
                    error.message = "Database Down";
                if (error.code === "P2002")
                    error.message = "Email Already In Use";
            }
            res.status(404).send({ message: error.message });
        }
    }));
    router.post("/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            if (!email || !password)
                throw Error("Incomplete Information");
            const passwordHash = (0, generateHash_1.default)(email, password);
            const user = yield (0, AuthService_1.DB_verifyUser)({ email, passwordHash });
            const token = (0, useJwtToken_1.generateJwtToken)({ email, passwordHash });
            res.set("token", token);
            res.status(200).send({ user });
        }
        catch (error) {
            res.status(401).send({
                message: error.message,
            });
        }
    }));
    router.get("/verify", AuthMiddleware_1.AuthMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.status(200).send();
    }));
    return router;
}
exports.default = AuthController;
