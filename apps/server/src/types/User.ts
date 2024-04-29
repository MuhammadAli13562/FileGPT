import { Response } from "express";
import { ChatMessage } from "llamaindex";

export interface SendMessageType {
  message: string;
  id: string;
}

export interface ContextWindowType {
  vectorURL: string;
  fileURL: string;
  fileName: string;
  fileKey: string;
  email: string;
}

export interface EmbedDocumentInputType {
  text: string;
  Key: String;
}

export interface QueryDocumentInputType {
  vectorURL: string;
  res: Response;
  chatEngineMessages: ChatMessage[];
  message: string;
}

export interface StoreChatDataInputType {
  newChatWindowMessages: ChatMessage[];
  newChatEngineMessages: ChatMessage[];
  Id: number;
}
