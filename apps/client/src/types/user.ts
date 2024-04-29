export interface queryInputType {
  id: number;
  message: string;
}

export interface uploadInputType {
  form: FormData;
}

export interface MessageType {
  content: string;
  role: "user" | "assistant";
}
