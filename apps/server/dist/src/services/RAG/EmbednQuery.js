"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAG_QueryDocument = exports.RAG_EmbedDocument = void 0;
const llamaindex_1 = require("llamaindex");
const dotenv_1 = __importDefault(require("dotenv"));
const node_path_1 = __importDefault(require("node:path"));
dotenv_1.default.config();
const GROQ_API = process.env.GROQ_API_KEY;
const LLM_MODEL = process.env.LLM_MODEL;
llamaindex_1.Settings.llm = new llamaindex_1.Groq({ apiKey: GROQ_API, model: LLM_MODEL, maxTokens: 512 });
const RAG_EmbedDocument = (EmbedDocumentInput) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text, Key } = EmbedDocumentInput;
        const document = new llamaindex_1.Document({ text });
        const EmbedPath = node_path_1.default.resolve(__dirname, `./storage/${Key}`);
        const storageContext = yield (0, llamaindex_1.storageContextFromDefaults)({
            persistDir: EmbedPath,
        });
        // this command will create embeddings using openAI Model
        yield llamaindex_1.VectorStoreIndex.fromDocuments([document], {
            storageContext,
        });
        // Return the Persistance Directory for future fetching
        return EmbedPath;
    }
    catch (error) {
        console.log("Embed Error : ", error);
        throw Error("Error Creating Embeddings");
    }
});
exports.RAG_EmbedDocument = RAG_EmbedDocument;
const RAG_QueryDocument = (QueryDocumentInput) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const { vectorURL, message, res, chatEngineMessages } = QueryDocumentInput;
        const storageContext = yield (0, llamaindex_1.storageContextFromDefaults)({
            persistDir: vectorURL,
        });
        const index = yield llamaindex_1.VectorStoreIndex.init({
            storageContext,
        });
        const retriever = index.asRetriever();
        const lessened_chat_engines = chatEngineMessages.slice(-4);
        const chatEngine = new llamaindex_1.ContextChatEngine({
            chatModel: llamaindex_1.Settings.llm,
            chatHistory: lessened_chat_engines,
            retriever,
        });
        const stream = yield chatEngine.chat({
            message: `

      Instructions : For below query , Be succinct in your response and hide any sensitive information like social security numbers , credit card numbers etc but not the names and usual information that is not sensitive.

       --------------------------------------------
          query : ${message}
       --------------------------------------------
      `,
            stream: true,
        });
        res.writeHead(200, {
            "Content-Type": "application/json",
        });
        let result = "";
        try {
            for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
                _c = stream_1_1.value;
                _d = false;
                const chunk = _c;
                console.log(chunk.response);
                result += chunk.response;
                // HTTP PIPELINE
                res.write(JSON.stringify(chunk.response));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        //res.write(result);
        // Returned the whole chat history
        return { newChatEngineMessages: chatEngine.chatHistory.messages, newChatWindowMessage: result };
    }
    catch (error) {
        console.log("Error In RAG Query", error.message);
        throw Error(error.message);
    }
});
exports.RAG_QueryDocument = RAG_QueryDocument;
