import {
  Document,
  Settings,
  VectorStoreIndex,
  Groq,
  storageContextFromDefaults,
  ContextChatEngine,
  QdrantVectorStore,
  IndexStructType,
  IndexStruct,
  BaseIndexStore,
} from "llamaindex";
import { EmbedDocumentInputType, QueryDocumentInputType } from "../../types/User";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config();
const GROQ_API = process.env.GROQ_API_KEY;
const LLM_MODEL = process.env.LLM_MODEL;

Settings.llm = new Groq({ apiKey: GROQ_API, model: LLM_MODEL, maxTokens: 512 });

export const RAG_EmbedDocument = async (EmbedDocumentInput: EmbedDocumentInputType) => {
  try {
    const { text, Key } = EmbedDocumentInput;

    const document = new Document({ text });
    const EmbedPath = path.resolve(__dirname, `./storage/${Key}`);

    const vectorStore = new QdrantVectorStore({
      url: "http://localhost:6333",
    });

    // this command will create embeddings using openAI Model
    const res = await VectorStoreIndex.fromDocuments([document], {
      vectorStore,
    });

    console.log("vec store : ", res.indexStruct);

    // Return the Persistance Directory for future fetching
    return EmbedPath;
  } catch (error) {
    console.log("Embed Error : ", error);

    throw Error("Error Creating Embeddings");
  }
};

export const RAG_QueryDocument = async (QueryDocumentInput: QueryDocumentInputType) => {
  try {
    const { vectorURL, message, res, chatEngineMessages } = QueryDocumentInput;

    // const storageContext = await storageContextFromDefaults({
    //   persistDir: vectorURL,
    // });
    const vectorStore = new QdrantVectorStore({
      url: "http://localhost:6333",
    });

    const indexStruct = await BaseIndexStore;

    const index = await VectorStoreIndex.init({
      vectorStore,
      indexStruct: new IndexStruct({
        indexId: "ea947bf2-85b6-4853-b198-5e5c1855cfe9",
        type: IndexStructType.SIMPLE_DICT,
      }),
    });

    const retriever = index.asRetriever();

    const lessened_chat_engines = chatEngineMessages.slice(-4);

    const chatEngine = new ContextChatEngine({
      chatModel: Settings.llm,
      chatHistory: lessened_chat_engines,
      retriever,
    });

    const stream = await chatEngine.chat({
      message: `

      Instructions: Please provide a concise response to the following query. Ensure that any sensitive information, such as social security numbers or credit card numbers, is redacted. However, please retain non-sensitive information such as names and other usual details.

      --------------------------------------------
      Query: ${message}
      --------------------------------------------
      `,
      stream: true,
    });

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    let result = "";

    for await (const chunk of stream) {
      console.log(chunk.response);
      result += chunk.response;
      // HTTP PIPELINE
      res.write(JSON.stringify(chunk.response));
    }

    //res.write(result);
    // Returned the whole chat history

    return { newChatEngineMessages: chatEngine.chatHistory.messages, newChatWindowMessage: result };
  } catch (error: any) {
    console.log("Error In RAG Query", error.message);
    throw Error(error.message);
  }
};
