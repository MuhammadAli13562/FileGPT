"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("./src/controllers/UserController"));
const AuthController_1 = __importDefault(require("./src/controllers/AuthController"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ exposedHeaders: ["*"] }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.use("/auth", (0, AuthController_1.default)());
app.use("/user", (0, UserController_1.default)());
app.listen(3000, () => {
    console.log("Server running on 3000");
});
