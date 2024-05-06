export interface queryInputType {
  id: string;
  message: string;
}

export interface uploadInputType {
  form: FormData;
}

export interface MessageType {
  content: string;
  role: "user" | "assistant";
}
