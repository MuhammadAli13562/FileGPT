export interface queryInputType {
  id: string;
  message: string;
}

export interface uploadInputType {
  file: File[];
}

export interface MessageType {
  message: string;
  role: "user" | "assistant";
}
