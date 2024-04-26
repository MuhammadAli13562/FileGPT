import { Response, Request, Router } from "express";
import {
  DB_createContextWindow,
  DB_getContextData,
  DB_getUserData,
  DB_storeChatData,
} from "../services/DB/UserService";
import multer from "multer";
import { v4 } from "uuid";
import { PutObjectCommand, PutObjectCommandInput, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3";
import dotenv from "dotenv";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { RAG_EmbedDocument, RAG_QueryDocument } from "../services/RAG/EmbednQuery";
import { QueryDocumentInputType, SendMessageType, StoreChatDataInputType } from "../types/User";

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
      const user = await DB_getUserData(res.get("email")!);

      res.status(200).send({ user });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  });

  router.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) throw Error("No File Provided");
      const Key = v4();

      //----------------------------------------------
      // Implement Indexing , Embedding , Logic Here

      const EmbedDocumentInput = {
        pdfPath: file.path,
        pdfKey: Key,
      };

      const vectorURL = await RAG_EmbedDocument(EmbedDocumentInput);

      //----------------------------------------------
      // Upload to S3 Logic Here

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
        pdfKey: Key,
        pdfName: file.filename,
        pdfURL: BucketLink + Key,
        vectorURL,
        email: res.get("email")!,
      };
      const ContextWindow = await DB_createContextWindow(ContextWindowInput);

      //----------------------------------------------
      //  Clean Up & Return

      await unlinkFile(file.path); // delete file from local disc
      res.status(200).send({ ContextWindow });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  });

  router.post("/queryDocument", async (req: Request, res: Response) => {
    try {
      //----------------------------------------------------------------
      // Retreive Context Data From DB

      const { contextWindow_id, message } = req.body as SendMessageType;
      const { chatMessages, vectorURL } = await DB_getContextData(contextWindow_id);

      //----------------------------------------------------------------
      // Query Document With Message which streams response and returns new Chat Messages

      const QueryDocumentInput: QueryDocumentInputType = {
        res,
        message,
        vectorURL,
        chatMessages: JSON.parse(chatMessages as string),
      };
      const new_chatMessages = await RAG_QueryDocument(QueryDocumentInput);

      //----------------------------------------------------------------
      // Update Context Window in DB with New Chat Messages

      const StoreChatDataInput: StoreChatDataInputType = {
        chatMessages: new_chatMessages,
        Id: contextWindow_id,
      };
      await DB_storeChatData(StoreChatDataInput);

      //----------------------------------------------------------------
      // End the Response

      res.end();
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  });

  return router;
}
