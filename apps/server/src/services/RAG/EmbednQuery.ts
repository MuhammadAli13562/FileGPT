import fs from "node:fs/promises";
import {
  Document,
  Settings,
  VectorStoreIndex,
  Groq,
  storageContextFromDefaults,
  ContextChatEngine,
} from "llamaindex";
import { EmbedDocumentInputType, QueryDocumentInputType } from "../../types/User";
import dotenv from "dotenv";
import path from "node:path";
const PDFParser = require("pdf-parse");

dotenv.config();
const GROQ_API = process.env.GROQ_API_KEY;
const LLM_MODEL = process.env.LLM_MODEL;

Settings.llm = new Groq({ apiKey: GROQ_API, model: LLM_MODEL });

export const RAG_EmbedDocument = async (EmbedDocumentInput: EmbedDocumentInputType) => {
  try {
    const { pdfPath, pdfKey } = EmbedDocumentInput;

    const pdfBuffer = await fs.readFile(pdfPath);
    const pdfText = await PDFParser(pdfBuffer);

    const document = new Document({ text: pdfText.text });

    const EmbedPath = path.resolve(__dirname, `./storage/${pdfKey}`);

    const storageContext = await storageContextFromDefaults({
      persistDir: EmbedPath,
    });

    // this command will create embeddings using openAI Model
    await VectorStoreIndex.fromDocuments([document], {
      storageContext,
    });

    // Return the Persistance Directory for future fetching
    return EmbedPath;
  } catch (error) {
    console.log("Embed Error : ", error);

    throw Error("Error Creating Embeddings");
  }
};

export const RAG_QueryDocument = async (QueryDocumentInput: QueryDocumentInputType) => {
  try {
    const { vectorURL, message, res, chatMessages } = QueryDocumentInput;

    const storageContext = await storageContextFromDefaults({
      persistDir: vectorURL,
    });

    const index = await VectorStoreIndex.init({
      storageContext,
    });

    const retriever = index.asRetriever();

    const chatEngine = new ContextChatEngine({
      chatModel: Settings.llm,
      chatHistory: chatMessages,
      retriever,
    });

    const stream = await chatEngine.chat({
      message,
      stream: true,
    });

    res.writeHead(200, { "Content-Type": "application/json" });

    for await (const chunk of stream) {
      process.stdout.write(chunk.response);
      // HTTP PIPELINE
      res.write(JSON.stringify(chunk.response));
    }

    // Returned the whole chat history

    return JSON.stringify(chatEngine.chatHistory.messages);
  } catch (error: any) {
    console.log("Error In RAG Query", error.message);
    throw Error(error.message);
  }
};
