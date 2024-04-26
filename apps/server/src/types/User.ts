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

export interface ContextWindowUpdateType {
  id: number;
  chatMessages: string;
}

export interface EmbedDocumentInputType {
  pdfPath: string;
  pdfKey: String;
}
