import { Response, Request, Router } from "express";
import {
  DB_createContextWindow,
  DB_deleteContextWindow,
  DB_getContextData,
  DB_getUserData,
  DB_getUserMetaData,
  DB_storeChatData,
} from "../services/DB/UserService";
import multer from "multer";
import { v4 } from "uuid";
import { PutObjectCommand, PutObjectCommandInput, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3";
import dotenv from "dotenv";
import { RAG_EmbedDocument, RAG_QueryDocument } from "../services/RAG/EmbednQuery";
import { convertFileToText } from "../services/RAG/FileHanding";
import { QueryDocumentInputType, SendMessageType, StoreChatDataInputType } from "../types/User";
import { ChatMessage } from "llamaindex";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

dotenv.config();
const Bucket = process.env.AWS_BUCKET_NAME;
const BucketLink = process.env.AWS_BUCKET_LINK;

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const multerStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

export default function UserController() {
  const router = Router();

  router.get("/data", AuthMiddleware, async (req: Request, res: Response) => {
    try {
      const user_email = res.get("email")!;
      const user = await DB_getUserData(user_email);
      console.log("user data : ", user);

      res.status(200).send({ user });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  });
  router.get("/data/:id", AuthMiddleware, async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const ContextWindow = await DB_getContextData(id);
      res.status(200).send({ ContextWindow });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  });
  router.get("/meta", AuthMiddleware, async (req: Request, res: Response) => {
    try {
      const user_email = res.get("email")!;
      const user = await DB_getUserMetaData(user_email);

      res.status(200).send({ user });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  });
  router.post("/query", AuthMiddleware, async (req: Request, res: Response) => {
    try {
      //----------------------------------------------------------------
      // Retreive Context Data From DB

      const { id, message } = req.body as SendMessageType;
      if (!id || !message) throw Error("Incomplete Information");

      const { chatEngineMessages, vectorURL } = await DB_getContextData(id);

      //----------------------------------------------------------------
      // Query Document With Message which streams response and returns new Chat Messages

      const QueryDocumentInput: QueryDocumentInputType = {
        res,
        message,
        vectorURL,
        chatEngineMessages: chatEngineMessages as ChatMessage[],
      };
      const { newChatEngineMessages, newChatWindowMessage } = await RAG_QueryDocument(QueryDocumentInput);

      const newChatWindowMessages: ChatMessage[] = [
        { content: message, role: "user" },
        { content: newChatWindowMessage, role: "assistant" },
      ];

      //----------------------------------------------------------------
      // Update Context Window in DB with New Chat Messages

      const StoreChatDataInput: StoreChatDataInputType = {
        newChatWindowMessages,
        newChatEngineMessages,
        Id: id,
      };
      await DB_storeChatData(StoreChatDataInput);

      //----------------------------------------------------------------
      // End the Response

      res.end();
    } catch (error: any) {
      console.log("error query : ", error.message);

      res.status(404).send({ message: error.message });
    }
  });
  router.post("/upload", AuthMiddleware, upload.single("file"), async (req: Request, res: Response) => {
    try {
      const user_email = res.get("email")!;
      let file = req.file;
      if (!file) throw Error("No File Provided");
      const Key = v4();

      //----------------------------------------------
      // File Handling -- Convert all formats to text

      const fileText = await convertFileToText(file);

      //----------------------------------------------
      // Implement Indexing , Embedding , Logic Here

      const EmbedDocumentInput = {
        text: fileText,
        Key,
      };

      const vectorURL = await RAG_EmbedDocument(EmbedDocumentInput);

      // //----------------------------------------------
      // Upload to S3

      const PutCommandInput: PutObjectCommandInput = {
        Bucket,
        Body: fs.createReadStream(file.path),
        Key,
        ContentType: file.mimetype,
      };
      await s3.send(new PutObjectCommand(PutCommandInput));

      //----------------------------------------------
      //  Create New ContextWindow Data in Prisma Here

      const ContextWindowInput = {
        fileKey: Key,
        fileName: file.filename,
        fileURL: BucketLink + Key,
        vectorURL,
        email: user_email,
      };
      const ContextWindow = await DB_createContextWindow(ContextWindowInput);

      // //----------------------------------------------
      // //  Clean Up & Return

      await unlinkFile(file.path); // delete file from local disc
      res.status(200).send({ ContextWindow });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  });
  router.delete("/delete", AuthMiddleware, async (req: Request, res: Response) => {
    try {
      const { id } = req.body as { id: string };
      const Id = Number(id);
      await DB_deleteContextWindow(Id);
      res.status(200).send({ message: "Deleted Successfuly" });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  });

  return router;
}
