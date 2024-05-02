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
const UserService_1 = require("../services/DB/UserService");
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_1 = require("../config/s3");
const dotenv_1 = __importDefault(require("dotenv"));
const EmbednQuery_1 = require("../services/RAG/EmbednQuery");
const FileHanding_1 = require("../services/RAG/FileHanding");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
dotenv_1.default.config();
const Bucket = process.env.AWS_BUCKET_NAME;
const BucketLink = process.env.AWS_BUCKET_LINK;
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const multerStorage = multer_1.default.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "uploads/");
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: multerStorage });
function UserController() {
    const router = (0, express_1.Router)();
    router.get("/data", AuthMiddleware_1.AuthMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user_email = res.get("email");
            const user = yield (0, UserService_1.DB_getUserData)(user_email);
            console.log("user data : ", user);
            res.status(200).send({ user });
        }
        catch (error) {
            res.status(404).send({ message: error.message });
        }
    }));
    router.post("/upload", AuthMiddleware_1.AuthMiddleware, upload.single("file"), (req, res) => __awaiter(this, void 0, void 0, function* () {
        console.log("request : ", req);
        try {
            const user_email = res.get("email");
            let file = req.file;
            if (!file)
                throw Error("No File Provided");
            const Key = (0, uuid_1.v4)();
            //----------------------------------------------
            // File Handling -- Convert all formats to text
            const fileText = yield (0, FileHanding_1.convertFileToText)(file);
            //----------------------------------------------
            // Implement Indexing , Embedding , Logic Here
            const EmbedDocumentInput = {
                text: fileText,
                Key,
            };
            const vectorURL = yield (0, EmbednQuery_1.RAG_EmbedDocument)(EmbedDocumentInput);
            // //----------------------------------------------
            // Upload to S3
            const PutCommandInput = {
                Bucket,
                Body: fs.createReadStream(file.path),
                Key,
                ContentType: file.mimetype,
            };
            yield s3_1.s3.send(new client_s3_1.PutObjectCommand(PutCommandInput));
            //----------------------------------------------
            //  Create New ContextWindow Data in Prisma Here
            const ContextWindowInput = {
                fileKey: Key,
                fileName: file.filename,
                fileURL: BucketLink + Key,
                vectorURL,
                email: user_email,
            };
            const ContextWindow = yield (0, UserService_1.DB_createContextWindow)(ContextWindowInput);
            // //----------------------------------------------
            // //  Clean Up & Return
            yield unlinkFile(file.path); // delete file from local disc
            res.status(200).send({ ContextWindow });
        }
        catch (error) {
            res.status(404).send({ message: error.message });
        }
    }));
    router.post("/query", AuthMiddleware_1.AuthMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            //----------------------------------------------------------------
            // Retreive Context Data From DB
            console.log(req.body);
            const { id, message } = req.body;
            if (!id || !message)
                throw Error("Incomplete Information");
            const Id = Number(id);
            const { chatEngineMessages, vectorURL } = yield (0, UserService_1.DB_getContextData)(Id);
            //----------------------------------------------------------------
            // Query Document With Message which streams response and returns new Chat Messages
            const QueryDocumentInput = {
                res,
                message,
                vectorURL,
                chatEngineMessages: chatEngineMessages,
            };
            const { newChatEngineMessages, newChatWindowMessage } = yield (0, EmbednQuery_1.RAG_QueryDocument)(QueryDocumentInput);
            const newChatWindowMessages = [
                { content: message, role: "user" },
                { content: newChatWindowMessage, role: "assistant" },
            ];
            //----------------------------------------------------------------
            // Update Context Window in DB with New Chat Messages
            const StoreChatDataInput = {
                newChatWindowMessages,
                newChatEngineMessages,
                Id,
            };
            yield (0, UserService_1.DB_storeChatData)(StoreChatDataInput);
            //----------------------------------------------------------------
            // End the Response
            res.end();
        }
        catch (error) {
            res.status(404).send({ message: error.message });
        }
    }));
    router.get("/meta", AuthMiddleware_1.AuthMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user_email = res.get("email");
            const user = yield (0, UserService_1.DB_getUserMetaData)(user_email);
            res.status(200).send({ user });
        }
        catch (error) {
            res.status(404).send({ message: error.message });
        }
    }));
    router.delete("/delete", AuthMiddleware_1.AuthMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            const Id = Number(id);
            yield (0, UserService_1.DB_deleteContextWindow)(Id);
            res.status(200).send({ message: "Deleted Successfuly" });
        }
        catch (error) {
            res.status(404).send({ message: error.message });
        }
    }));
    return router;
}
exports.default = UserController;
