import { Response } from "express";
import { ChatMessage } from "llamaindex";

export interface SendMessageType {
  message: string;
  contextWindow_id: number;
}

export interface ContextWindowType {
  vectorURL: string;
  pdfURL: string;
  pdfName: string;
  pdfKey: string;
  email: string;
}

export interface EmbedDocumentInputType {
  pdfPath: string;
  pdfKey: String;
}

export interface QueryDocumentInputType {
  vectorURL: string;
  res: Response;
  chatMessages: ChatMessage[];
  message: string;
}

export interface StoreChatDataInputType {
  chatMessages: string;
  Id: number;
}
