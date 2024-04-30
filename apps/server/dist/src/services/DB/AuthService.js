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
exports.DB_verifyUser = exports.DB_createUser = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
const client_2 = require("@prisma/client");
const DB_createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, name, passwordHash }) {
    try {
        const user = yield client_1.default.user.create({
            data: {
                email,
                name,
                passwordHash,
            },
        });
        return user;
    }
    catch (error) {
        if (error instanceof client_2.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002")
                error.message = "Email Already In Use";
            else if (error.code === "P1001")
                error.message = "Database Down";
        }
        throw Error(error.message);
    }
});
exports.DB_createUser = DB_createUser;
const DB_verifyUser = (_b) => __awaiter(void 0, [_b], void 0, function* ({ email, passwordHash }) {
    try {
        const user = yield client_1.default.user.findUnique({
            where: {
                email,
                passwordHash,
            },
        });
        if (user === null)
            throw Error("Incorrect Username or Password");
        return user;
    }
    catch (error) {
        throw Error(error.message);
    }
});
exports.DB_verifyUser = DB_verifyUser;
