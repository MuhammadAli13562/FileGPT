import fs from "node:fs/promises";
import {
  Document,
  Settings,
  VectorStoreIndex,
  Groq,
  storageContextFromDefaults,
  ContextChatEngine,
  ChatMessage,
  serviceContextFromDefaults,
} from "llamaindex";
import { writeFileSync } from "node:fs";
import { EmbedDocumentInputType } from "../../types/User";
import dotenv from "dotenv";
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

    const EmbedPath = `./storage/${pdfKey}`;
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
    throw Error("Error Creating Embeddings");
  }
};

export const RAG_QueryLLM = () => {};
