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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_getUserMetaData = exports.DB_storeChatData = exports.DB_getContextData = exports.DB_createContextWindow = exports.DB_getUserData = void 0;
const client_1 = require("@prisma/client");
const client_2 = __importDefault(require("../../prisma/client"));
const selections_1 = require("../../prisma/selections");
const DB_getUserData = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield client_2.default.user.findUnique({
            where: {
                email,
            },
            select: selections_1.UserSelect,
        });
        if (user === null)
            throw Error("No User Found");
        return user;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P1001")
                error.message = "Database Down";
        }
        throw Error(error.message);
    }
});
exports.DB_getUserData = DB_getUserData;
const DB_createContextWindow = (ContextWindowInput) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = ContextWindowInput, ContextData = __rest(ContextWindowInput, ["email"]);
    try {
        const ContextWindow = yield client_2.default.context_Window.create({
            data: Object.assign(Object.assign({}, ContextData), { chatEngineMessages: [], owner: {
                    connect: {
                        email,
                    },
                } }),
            select: selections_1.ContextSelect,
        });
        return ContextWindow;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P1001")
                error.message = "Database Down";
        }
        throw Error(error.message);
    }
});
exports.DB_createContextWindow = DB_createContextWindow;
const DB_getContextData = (Id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contextData = yield client_2.default.context_Window.findUnique({
            where: {
                Id,
            },
            select: selections_1.ContextSelect,
        });
        if (!contextData)
            throw Error("No Context Exists");
        return contextData;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P1001")
                error.message = "Database Down";
        }
        throw Error(error.message);
    }
});
exports.DB_getContextData = DB_getContextData;
const DB_storeChatData = (StoreChatDataInput) => __awaiter(void 0, void 0, void 0, function* () {
    const { Id, newChatEngineMessages, newChatWindowMessages } = StoreChatDataInput;
    try {
        yield client_2.default.context_Window.update({
            where: {
                Id,
            },
            data: {
                chatEngineMessages: newChatEngineMessages,
                ChatWindowMessages: {
                    createMany: {
                        data: newChatWindowMessages,
                    },
                },
            },
        });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P1001")
                error.message = "Database Down";
        }
        throw Error(error.message);
    }
});
exports.DB_storeChatData = DB_storeChatData;
const DB_getUserMetaData = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield client_2.default.user.findUnique({
            where: {
                email,
            },
            select: selections_1.UserMetaSelect,
        });
        if (user === null)
            throw Error("No User Found");
        return user;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P1001")
                error.message = "Database Down";
        }
        throw Error(error.message);
    }
});
exports.DB_getUserMetaData = DB_getUserMetaData;
